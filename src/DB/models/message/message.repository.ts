import { IMessage } from "../../../common";
import { AbstractDBRepository } from "../../repository/db.repository";
import { MessageModel } from "./message.model";

export class MessageRepository extends AbstractDBRepository<IMessage> {
  constructor() {
    super(MessageModel);
  }
}
export const messageRepo = new MessageRepository();
