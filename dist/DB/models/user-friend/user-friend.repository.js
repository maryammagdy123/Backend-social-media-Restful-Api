"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFriendRepository = void 0;
const db_repository_1 = require("../../repository/db.repository");
const user_friend_model_1 = require("./user-friend.model");
class UserFriendRepository extends db_repository_1.AbstractDBRepository {
    constructor() {
        super(user_friend_model_1.UserFriendModel);
    }
}
exports.UserFriendRepository = UserFriendRepository;
