import { Types } from "mongoose";

export interface IBlock {
  user: Types.ObjectId;
  blockedBy: Types.ObjectId;
}
