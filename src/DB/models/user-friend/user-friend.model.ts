import { model, Schema } from "mongoose";
import { IUserFriends } from "../../../common";

const userFriendSchema = new Schema<IUserFriends>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    friend: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {},
);
export const UserFriendModel = model("UserFriend", userFriendSchema);
