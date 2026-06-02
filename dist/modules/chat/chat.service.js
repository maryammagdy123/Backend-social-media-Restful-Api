"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = exports.ChatService = void 0;
const DB_1 = require("../../DB");
const exceptions_1 = require("../../common/exceptions");
const block_repository_1 = require("../../DB/models/block/block.repository");
class ChatService {
    chatRepo;
    messageRepo;
    friendRepo;
    blockRepo;
    constructor(chatRepo, messageRepo, friendRepo, blockRepo) {
        this.chatRepo = chatRepo;
        this.messageRepo = messageRepo;
        this.friendRepo = friendRepo;
        this.blockRepo = blockRepo;
    }
    createChat = async (friendId, userId) => {
        console.log({ friendId, userId });
        if (friendId.equals(userId)) {
            throw new exceptions_1.BadRequestError("You cannot chat with yourself");
        }
        if (!friendId || !userId) {
            throw new exceptions_1.BadRequestError("Invalid user id");
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
                    { user: friendId, friend: userId, },
                    { user: userId, friend: friendId }
                ]
            });
            console.log({ isFriend });
            const idsBlocked = await this.blockRepo.findOne({
                user: userId,
                blockedBy: friendId
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
exports.chatService = new ChatService(DB_1.chatRepo, DB_1.messageRepo, DB_1.userFriendRepo, block_repository_1.blockRepo);
