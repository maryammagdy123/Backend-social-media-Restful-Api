"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageService = exports.MessageService = void 0;
const DB_1 = require("../../DB");
const exceptions_1 = require("../../common/exceptions");
class MessageService {
    messageRepo;
    chatRepo;
    constructor(messageRepo, chatRepo) {
        this.messageRepo = messageRepo;
        this.chatRepo = chatRepo;
    }
    getMessages = async (chat) => {
        const messages = await this.messageRepo
            .find({ chat: chat })
            .populate("senderId", "username profilePicture")
            .sort({ createdAt: -1 })
            .limit(20);
        if (!messages) {
            throw new exceptions_1.NotFoundError("Messages not found");
        }
        return messages;
    };
    sendMessage = async (chatId, senderId, content) => {
        const chat = await this.chatRepo.findOne({ _id: chatId });
        if (!chat) {
            throw new exceptions_1.NotFoundError("Chat not found");
        }
        if (!chat.participants.includes(senderId)) {
            throw new exceptions_1.ForbiddenError("You are not allowed to send messages in this chat");
        }
        const message = await this.messageRepo.create({
            chat: chatId,
            senderId,
            content,
        });
        return message;
    };
}
exports.MessageService = MessageService;
exports.messageService = new MessageService(DB_1.messageRepo, DB_1.chatRepo);
