"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRepo = exports.MessageRepository = void 0;
const db_repository_1 = require("../../repository/db.repository");
const message_model_1 = require("./message.model");
class MessageRepository extends db_repository_1.AbstractDBRepository {
    constructor() {
        super(message_model_1.MessageModel);
    }
}
exports.MessageRepository = MessageRepository;
exports.messageRepo = new MessageRepository();
