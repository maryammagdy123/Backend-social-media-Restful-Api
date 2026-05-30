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
      ref:"User",
      required: function () {
        return this.type === ChatEnum.group;
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.type === ChatEnum.group;
      },
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
