"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFriendModel = void 0;
const mongoose_1 = require("mongoose");
const userFriendSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    friend: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {});
exports.UserFriendModel = (0, mongoose_1.model)("UserFriend", userFriendSchema);
