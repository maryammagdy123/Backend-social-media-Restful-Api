import { IChat } from "../../../common";
import { AbstractDBRepository } from "../../repository/db.repository";
import { ChatModel } from "./chat.model";

export class ChatRepository extends AbstractDBRepository<IChat> {
  constructor() {
    super(ChatModel);
  }
}
export const chatRepo = new ChatRepository();
