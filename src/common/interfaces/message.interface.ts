import { Types } from "mongoose";

export interface ILastMessage {
  content: string;
  senderId: Types.ObjectId;
}
