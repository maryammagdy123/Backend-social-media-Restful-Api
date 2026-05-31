"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = exports.ChatService = void 0;
const DB_1 = require("../../DB");
class ChatService {
    chatRepo;
    messageRepo;
    constructor(chatRepo, messageRepo) {
        this.chatRepo = chatRepo;
        this.messageRepo = messageRepo;
    }
    getChat = async (friendId, userId) => {
        const chat = await this.chatRepo
            .find({
            participants: {
                $all: [userId, friendId],
            },
        })
            .populate("participants", "username profilePicture");
        console.log({ chat });
        const messages = await this.getMessages(friendId, userId, chat._id);
        return {
            chat,
            messages,
        };
    };
    getMessages = async (friendId, userId, chatId) => {
        const messages = await this.messageRepo
            .find({
            $or: [
                {
                    senderId: friendId,
                },
                {
                    senderId: userId,
                },
            ],
            chatId,
        })
            .sort({ createdAt: -1 })
            .limit(20);
        return messages;
    };
}
exports.ChatService = ChatService;
exports.chatService = new ChatService(DB_1.chatRepo, DB_1.messageRepo);
