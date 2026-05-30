import { HydratedDocument } from "mongoose";
import { IChat } from "../interfaces";

export type ChatDocument = HydratedDocument<IChat>;
