import { Types } from "mongoose";
import { ChatEnum } from "../enums";
import { ILastMessage } from "./message.interface";

export interface IChat {
  participants: Types.ObjectId[];
  type: ChatEnum;
  admin?: Types.ObjectId[];
  createdBy?: Types.ObjectId;
  groupImage?: string;
  groupName?: string;
  groupId?: string;
  lastMessage: ILastMessage;
}
