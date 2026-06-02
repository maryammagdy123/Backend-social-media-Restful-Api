import { Types } from "mongoose";
import {
  chatRepo,
  ChatRepository,
  messageRepo,
  MessageRepository,
} from "../../DB";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../common/exceptions";

export class MessageService {
  constructor(
    private readonly messageRepo: MessageRepository,
    private readonly chatRepo: ChatRepository,
  ) {}

  public getMessages = async (chat: Types.ObjectId) => {
    const messages = await this.messageRepo
      .find({ chat: chat })
      .sort({ createdAt: -1 })
      .limit(20);

    if (!messages) {
      throw new NotFoundError("Messages not found");
    }
    return messages;
  };

  public sendMessage = async (
    chatId: Types.ObjectId,
    senderId: Types.ObjectId,
    content: string,
  ) => {
    //check if sender is part of the chat
    //TODO:enctrypt the message content before saving it to the database using a symmetric encryption algorithm and decrypt it when retrieving the messages
    const chat = await this.chatRepo.findById(chatId);
    if (!chat) {
      throw new NotFoundError("Chat not found");
    }
    if (!chat.participants.includes(senderId)) {
      throw new ForbiddenError(
        "You are not allowed to send messages in this chat",
      );
    }
    const message = await this.messageRepo.create({
      chat: chatId,
      senderId,
      content,
    });
    return message;
  };
}

export const messageService = new MessageService(messageRepo, chatRepo);
