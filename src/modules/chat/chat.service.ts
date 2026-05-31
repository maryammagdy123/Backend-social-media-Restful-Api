import { Types } from "mongoose";
import {
  chatRepo,
  ChatRepository,
  messageRepo,
  MessageRepository,
} from "../../DB";
import { NotFoundError } from "../../common/exceptions";
import { ChatDocument } from "../../common/types/chat.types";

export class ChatService {
  constructor(
    private readonly chatRepo: ChatRepository,
    private readonly messageRepo: MessageRepository,
  ) {}
  public getChat = async (friendId: Types.ObjectId, userId: Types.ObjectId) => {
    const chat = await this.chatRepo
      .find({
        participants: {
          $all: [userId, friendId],
        },
      })
      .populate("participants", "username profilePicture");

    console.log({chat});
    const messages = await this.getMessages(friendId, userId, chat._id);

    return {
      chat,
      messages,
    };
  };

  private getMessages = async (
    friendId: Types.ObjectId,
    userId: Types.ObjectId,
    chatId: Types.ObjectId,
  ) => {
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

export const chatService = new ChatService(chatRepo, messageRepo);
