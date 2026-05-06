"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("../../common/exceptions");
const DB_1 = require("../../DB");
const block_repository_1 = require("../../DB/models/block/block.repository");
class FriendsService {
    userFriendRepository;
    blockRepository;
    constructor(userFriendRepository, blockRepository) {
        this.userFriendRepository = userFriendRepository;
        this.blockRepository = blockRepository;
    }
    unfriend = async (userId, friendId) => {
        const friendship = await this.userFriendRepository.findOne({
            $or: [
                { user: userId, friend: friendId },
                { user: friendId, friend: userId },
            ],
        });
        if (!friendship)
            throw new exceptions_1.ConflictError("you are not friends with this user");
        if (userId.toString() === friendId.toString())
            throw new exceptions_1.ConflictError("you cannot unfriend yourself");
        return await this.userFriendRepository.deleteOne({ _id: friendship._id });
    };
    block = async (friendId, userId) => {
        if (userId.toString() === friendId.toString())
            throw new exceptions_1.ConflictError("you cannot block yourself");
        const isBlocked = await this.blockRepository.findOne({
            user: friendId,
            blockedBy: userId,
        });
        if (isBlocked)
            throw new exceptions_1.ConflictError("this user is already blocked");
        const isFriend = await this.userFriendRepository.findOne({
            $or: [
                { user: userId, friend: friendId },
                { user: friendId, friend: userId },
            ],
        });
        if (isFriend) {
            await this.userFriendRepository.deleteOne({ _id: isFriend._id });
        }
        return await this.blockRepository.create({
            user: friendId,
            blockedBy: userId,
        });
    };
}
exports.default = new FriendsService(new DB_1.UserFriendRepository(), new block_repository_1.BlockRepository());
