"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRepo = exports.ChatRepository = void 0;
const db_repository_1 = require("../../repository/db.repository");
const chat_model_1 = require("./chat.model");
class ChatRepository extends db_repository_1.AbstractDBRepository {
    constructor() {
        super(chat_model_1.ChatModel);
    }
}
exports.ChatRepository = ChatRepository;
exports.chatRepo = new ChatRepository();
