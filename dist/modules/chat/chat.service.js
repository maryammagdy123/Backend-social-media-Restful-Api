"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = exports.ChatService = void 0;
const DB_1 = require("../../DB");
const exceptions_1 = require("../../common/exceptions");
const block_repository_1 = require("../../DB/models/block/block.repository");
const message_1 = require("../message");
class ChatService {
    chatRepo;
    messageService;
    friendRepo;
    blockRepo;
    constructor(chatRepo, messageService, friendRepo, blockRepo) {
        this.chatRepo = chatRepo;
        this.messageService = messageService;
        this.friendRepo = friendRepo;
        this.blockRepo = blockRepo;
    }
    createChat = async (friendId, userId) => {
        console.log({ friendId, userId });
        if (!friendId || !userId) {
            throw new exceptions_1.BadRequestError("Invalid user id");
        }
        if (friendId.equals(userId)) {
            throw new exceptions_1.BadRequestError("You cannot chat with yourself");
        }
        const existingChat = await this.chatRepo.findOne({
            participants: {
                $all: [userId, friendId],
            },
        });
        console.log({ existingChat });
        if (!existingChat) {
            const isFriend = await this.friendRepo.findOne({
                $or: [
                    { user: friendId, friend: userId },
                    { user: userId, friend: friendId },
                ],
            });
            console.log({ isFriend });
            const idsBlocked = await this.blockRepo.findOne({
                user: userId,
                blockedBy: friendId,
            });
            if (!isFriend) {
                throw new exceptions_1.BadRequestError("You can only chat with your friends");
            }
            if (idsBlocked) {
                throw new exceptions_1.BadRequestError("You have been blocked by this user");
            }
            const newChat = await this.chatRepo.create({
                participants: [userId, friendId],
            });
            return newChat;
        }
        return existingChat;
    };
    getChat = async (friendId, userId) => {
        const chat = await this.chatRepo
            .findOne({
            participants: {
                $all: [userId, friendId],
            },
        })
            .populate("participants", "username profilePicture");
        if (!chat) {
            throw new exceptions_1.NotFoundError("Chat not found");
        }
        const messages = await message_1.messageService.getMessages(chat._id);
        return {
            chat,
            messages,
        };
    };
}
exports.ChatService = ChatService;
exports.chatService = new ChatService(DB_1.chatRepo, message_1.messageService, DB_1.userFriendRepo, block_repository_1.blockRepo);
