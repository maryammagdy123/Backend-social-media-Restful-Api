import { Types } from "mongoose";

export interface IUserFriends {
  user: Types.ObjectId;
  friend: Types.ObjectId;
}
