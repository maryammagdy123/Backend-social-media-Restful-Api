"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedService = exports.FeedService = void 0;
const DB_1 = require("../../DB");
class FeedService {
    postRepo;
    friendRepo;
    reactionRepo;
    commentRepo;
    constructor() {
        this.postRepo = new DB_1.PostRepository();
        this.friendRepo = new DB_1.UserFriendRepository();
        this.reactionRepo = new DB_1.UserReactionRepository();
        this.commentRepo = new DB_1.CommentRepository();
    }
    getUserFeed = async (user, { page = 1, limit = 10 }) => {
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
exports.FeedService = FeedService;
exports.feedService = new FeedService();
