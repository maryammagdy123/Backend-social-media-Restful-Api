"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModel = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../../../common");
const ChatSchema = new mongoose_1.Schema({
    participants: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "User",
        required: true,
    },
    type: {
        type: Number,
        enum: common_1.ChatEnum,
        default: common_1.ChatEnum.private,
    },
    admin: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    groupImage: String,
    groupName: String,
    groupId: String,
    lastMessage: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Message",
    },
}, { timestamps: true });
exports.ChatModel = (0, mongoose_1.model)("Chat", ChatSchema);
