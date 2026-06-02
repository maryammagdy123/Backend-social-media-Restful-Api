import { Types } from "mongoose";
import { messageRepo, MessageRepository } from "../../DB";
import { NotFoundError } from "../../common/exceptions";

export class MessageService {
  constructor(private readonly messageRepo: MessageRepository) {}

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
}

export const messageService = new MessageService(messageRepo);
