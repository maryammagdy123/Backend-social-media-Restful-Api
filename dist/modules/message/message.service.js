"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageService = exports.MessageService = void 0;
const DB_1 = require("../../DB");
const exceptions_1 = require("../../common/exceptions");
class MessageService {
    messageRepo;
    constructor(messageRepo) {
        this.messageRepo = messageRepo;
    }
    getMessages = async (chat) => {
        const messages = await this.messageRepo
            .find({ chat: chat })
            .sort({ createdAt: -1 })
            .limit(20);
        if (!messages) {
            throw new exceptions_1.NotFoundError("Messages not found");
        }
        return messages;
    };
}
exports.MessageService = MessageService;
exports.messageService = new MessageService(DB_1.messageRepo);
