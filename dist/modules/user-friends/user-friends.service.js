"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("../../common/exceptions");
const DB_1 = require("../../DB");
class FriendsService {
    userFriendRepository;
    constructor(userFriendRepository) {
        this.userFriendRepository = userFriendRepository;
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
    block = async () => { };
}
exports.default = new FriendsService(new DB_1.UserFriendRepository());
