import { Types } from "mongoose";
import {
  chatRepo,
  ChatRepository,
  messageRepo,
  MessageRepository,
  userFriendRepo,
  UserFriendRepository,
} from "../../DB";
import { BadRequestError, NotFoundError } from "../../common/exceptions";
import {
  blockRepo,
  BlockRepository,
} from "../../DB/models/block/block.repository";

export class ChatService {
  constructor(
    private readonly chatRepo: ChatRepository,
    private readonly messageRepo: MessageRepository,
    private readonly friendRepo: UserFriendRepository,
    private readonly blockRepo: BlockRepository,
  ) {}

  // create chat between two users
  public createChat = async (
    friendId: Types.ObjectId,
    userId: Types.ObjectId,
  ) => {
    //check if users are friends and can chat with each other
    //check if the user is trying to chat with themselves
    //TODO:check if users are not friend and the desired user enabling chat with non friends
    //check if user is blocked by the desired user or blocking the desired user
    console.log({ friendId, userId });
    if (!friendId || !userId) {
      throw new BadRequestError("Invalid user id");
    }
    if (friendId.equals(userId)) {
      throw new BadRequestError("You cannot chat with yourself");
    }
    // check if chat already exists
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
        throw new BadRequestError("You can only chat with your friends");
      }
      if (idsBlocked) {
        throw new BadRequestError("You have been blocked by this user");
      }
      //create new chat
      const newChat = await this.chatRepo.create({
        participants: [userId, friendId],
      });
      return newChat;
    }

    return existingChat;
  };

  public getChat = async (friendId: Types.ObjectId, userId: Types.ObjectId) => {
    const chat = await this.chatRepo
      .findOne({
        participants: {
          $all: [userId, friendId],
        },
      })
      .populate("participants", "username profilePicture");
    if (!chat) {
      throw new NotFoundError("Chat not found");
    }
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

export const chatService = new ChatService(
  chatRepo,
  messageRepo,
  userFriendRepo,
  blockRepo,
);
