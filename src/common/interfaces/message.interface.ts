import { Types } from "mongoose";

export interface IMessage {
  content: string;
  senderId: Types.ObjectId;
  chat: Types.ObjectId; //chat has the all participants
  readBy?: { user: Types.ObjectId; readAt: Date }[];
  deleteFor?: { user: Types.ObjectId; deletedAt: Date }[];
}
