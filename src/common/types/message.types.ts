import { HydratedDocument } from "mongoose";
import { IMessage } from "../interfaces";

export type MessageDocument=HydratedDocument<IMessage>