import { model, Schema } from "mongoose";
import { IMessage } from "../../../common";

export const MessageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    readBy: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    deleteFor: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        deletedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const MessageModel = model("Message", MessageSchema);
