import { PaginateDTO, UserDocument } from "../../common";
import {
  CommentRepository,
  PostRepository,
  UserFriendRepository,
  UserReactionRepository,
} from "../../DB";

export class FeedService {
  private readonly postRepo: PostRepository;
  private readonly friendRepo: UserFriendRepository;
  private readonly reactionRepo: UserReactionRepository;
  private readonly commentRepo: CommentRepository;
  constructor() {
    this.postRepo = new PostRepository();
    this.friendRepo = new UserFriendRepository();
    this.reactionRepo = new UserReactionRepository();
    this.commentRepo = new CommentRepository();
  }

  /**
   * authenticate user
   * authenticate user's friends
   * showing all friends posts , following friends , suggestions pages , posts
   * get friends and get recent posts for each friend() ,newest
   */
  public getUserFeed = async (
    user: UserDocument,
    { page = 1, limit = 10 }: PaginateDTO,
  ) => {
    const userId = user._id;
    const skip = (page - 1) * limit;
    const friends = await this.friendRepo.find({
      $or: [{ user: userId }, { friend: userId }],
    });

    const friendsIds = friends.map((item) => {
      if (item.user.toString() === userId.toString()) {
        return item.friend;
      }

      return item.user;
    });

    const usersIds = [userId, ...friendsIds];
    const posts = await this.postRepo
      .find({
        userId: { $in: usersIds },
      })
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const postsIds = posts.map((item) => item._id);
    const reactions = await this.reactionRepo.aggregate([
      {
        $match: {
          refId: { $in: postsIds },
        },
      },
      {
        $group: {
          _id: "$refId",
          count: { $sum: 1 },
          reactions: {
            $push: "$$ROOT",
          },
        },
      },
    ]);
    const comments = await this.commentRepo.aggregate([
      {
        $match: {
          postId: { $in: postsIds },
        },
      },
      {
        $group: {
          _id: "$postId",
          comments: { $push: "$$ROOT" },
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      posts,
      reactions,
      comments,
    };
  };
}

export const feedService = new FeedService();
