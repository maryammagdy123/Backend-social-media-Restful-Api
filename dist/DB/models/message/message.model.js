"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = exports.MessageSchema = void 0;
const mongoose_1 = require("mongoose");
exports.MessageSchema = new mongoose_1.Schema({
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    chat: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    readBy: [
        {
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "User",
            },
            readAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    deleteFor: [
        {
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "User",
            },
            deletedAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
}, {
    timestamps: true,
});
exports.MessageModel = (0, mongoose_1.model)("Message", exports.MessageSchema);
