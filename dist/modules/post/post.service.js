"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postService = exports.PostService = void 0;
const post_1 = require("../../DB/models/post");
const exceptions_1 = require("../../common/exceptions");
const user_reaction_repository_1 = require("../../DB/models/user-reaction/user-reaction.repository");
const common_1 = require("../../common");
const init_1 = require("../../common/providers/notification/firebase/init");
const init_2 = require("../../common/providers/cache/redis/init");
class PostService {
    postRepo;
    userReactionRepo;
    firebasePushNotificationService;
    cacheProvider;
    constructor(postRepo, userReactionRepo, firebasePushNotificationService, cacheProvider) {
        this.postRepo = postRepo;
        this.userReactionRepo = userReactionRepo;
        this.firebasePushNotificationService = firebasePushNotificationService;
        this.cacheProvider = cacheProvider;
    }
    createPost = async (createPostDTO, userId) => {
        return await this.postRepo.create({
            ...createPostDTO,
            userId,
        });
    };
    reactToPost = async (postReactionDTO, userId) => {
        const post = await this.postRepo.findById(postReactionDTO.postId);
        if (!post) {
            throw new exceptions_1.NotFoundError("post not found");
        }
        const existingReaction = await this.userReactionRepo.findOne({
            userId,
            refId: postReactionDTO.postId,
        });
        if (!existingReaction) {
            await this.postRepo.updateOne({ _id: postReactionDTO.postId }, { $inc: { reactionsCount: 1 } });
            await this.userReactionRepo.create({
                onModel: common_1.ON_MODEL.Post,
                type: postReactionDTO.type,
                refId: post._id,
                userId,
            });
            if (post.userId.toString() === userId.toString()) {
                return;
            }
            const postOwnerFcmTokens = await this.cacheProvider.sMembers(`${post.userId}:FCM`);
            if (postOwnerFcmTokens.length > 0) {
                await this.firebasePushNotificationService.sendMultiple(postOwnerFcmTokens, {
                    title: "New Reaction",
                    body: `You have a new reaction on your post ${post._id} from user ${userId} who reacted with ${postReactionDTO.type}`,
                });
            }
            return;
        }
        if (existingReaction.type !== postReactionDTO.type) {
            existingReaction.type = postReactionDTO.type;
            return await existingReaction.save();
        }
        if (post.reactionsCount !== 0) {
            await this.postRepo.updateOne({ _id: postReactionDTO.postId }, { $inc: { reactionsCount: -1 } });
        }
        return await this.userReactionRepo.findByIdAndDelete(existingReaction._id);
    };
    updatePost = async (postId, updateData, userId) => { };
    updateCommentPrivacyOnPost = async (id, userId, commentPrivacy) => {
        const post = await this.postRepo.findById(id);
        if (!post) {
            throw new exceptions_1.NotFoundError("post not found");
        }
        if (post.userId.toString() !== userId.toString()) {
            throw new exceptions_1.NotFoundError("you are not the owner of this post");
        }
        post.commentPrivacy = commentPrivacy;
        return await post.save();
    };
}
exports.PostService = PostService;
exports.postService = new PostService(new post_1.PostRepository(), new user_reaction_repository_1.UserReactionRepository(), init_1.firebasePushNotificationProvider, init_2.redisService);
