import { Types } from "mongoose";
import { CreatePostDTO, PostReactionDTO } from "./post.dto";
import { PostRepository } from "../../DB/models/post";
import { NotFoundError } from "../../common/exceptions";
import { UserReactionRepository } from "../../DB/models/user-reaction/user-reaction.repository";
import { CommentPrivacy, ON_MODEL } from "../../common";
import FirebasePushNotificationProvider from "../../common/providers/notification/firebase/firebase.service";
import { firebasePushNotificationProvider } from "../../common/providers/notification/firebase/init";
import { ICacheProvider } from "../../common/providers/cache/cache.interface";
import { redisService } from "../../common/providers/cache/redis/init";

export class PostService {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly userReactionRepo: UserReactionRepository,
    private readonly firebasePushNotificationService: FirebasePushNotificationProvider,
    private readonly cacheProvider: ICacheProvider,
  ) {}

  public createPost = async (
    createPostDTO: CreatePostDTO,
    userId: Types.ObjectId,
  ) => {
    return await this.postRepo.create({
      ...createPostDTO,
      userId,
    });
  };

  public reactToPost = async (
    postReactionDTO: PostReactionDTO,
    userId: Types.ObjectId,
  ) => {
    const post = await this.postRepo.findById(postReactionDTO.postId);

    if (!post) {
      throw new NotFoundError("post not found");
    }

    const existingReaction = await this.userReactionRepo.findOne({
      userId,
      refId: postReactionDTO.postId,
    });

    //  add new reaction
    if (!existingReaction) {
      await this.postRepo.updateOne(
        { _id: postReactionDTO.postId },
        { $inc: { reactionsCount: 1 } },
      );

      await this.userReactionRepo.create({
        onModel: ON_MODEL.Post,
        type: postReactionDTO.type,
        refId: post._id,
        userId,
      });

      // if the user is the owner of the post do not send notification
      if (post.userId.toString() === userId.toString()) {
        return;
      }
      
      // send notification to post owner
      //get all fcm tokens of the post owner and send notification to them
      const postOwnerFcmTokens = await this.cacheProvider.sMembers(
        `${post.userId}:FCM`,
      );
      if (postOwnerFcmTokens.length > 0) {
        await this.firebasePushNotificationService.sendMultiple(
          postOwnerFcmTokens,
          {
            title: "New Reaction",
            body: `You have a new reaction on your post ${post._id} from user ${userId} who reacted with ${postReactionDTO.type}`,
          },
        );
      }
      return;
    }

    //  change reaction type
    if (existingReaction.type !== postReactionDTO.type) {
      existingReaction.type = postReactionDTO.type;
      return await existingReaction.save();
    }

    // remove reaction
    if (post.reactionsCount !== 0) {
      await this.postRepo.updateOne(
        { _id: postReactionDTO.postId },
        { $inc: { reactionsCount: -1 } },
      );
    }

    return await this.userReactionRepo.findByIdAndDelete(existingReaction._id);
  };
  public updatePost = async (
    postId: Types.ObjectId,
    updateData: Partial<CreatePostDTO>,
    userId: Types.ObjectId,
  ) => {};

  public updateCommentPrivacyOnPost = async (
    id: Types.ObjectId,
    userId: Types.ObjectId,
    commentPrivacy: CommentPrivacy,
  ) => {
    //update comment privacy , set to (public ,disabled , friends only)
    //check if post exists and belongs to the user
    //check if the logged in user is the owner of the post
    const post = await this.postRepo.findById(id);
    if (!post) {
      throw new NotFoundError("post not found");
    }
    if (post.userId.toString() !== userId.toString()) {
      throw new NotFoundError("you are not the owner of this post");
    }
    post.commentPrivacy = commentPrivacy;
    return await post.save();
  };
}
export const postService = new PostService(
  new PostRepository(),
  new UserReactionRepository(),
  firebasePushNotificationProvider,
  redisService,
);
