import { model, Schema } from "mongoose";
import { IBlock } from "../../../common";
const blockSchema = new Schema<IBlock>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  blockedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});
export const BlockModel = model("Block", blockSchema);
                                                              