import { model, Schema } from "mongoose";
import { ChatEnum, IChat } from "../../../common";

const ChatSchema = new Schema<IChat>(
  {
    participants: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
    type: {
      type: Number,
      enum: ChatEnum,
      default: ChatEnum.private,
    },
    admin: {
      type: [Schema.Types.ObjectId],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    groupImage: String,
    groupName: String,
    groupId: String,
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true },
);

export const ChatModel = model("Chat", ChatSchema);
