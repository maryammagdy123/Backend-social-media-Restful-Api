import { IUserFriends } from "../../../common";
import { AbstractDBRepository } from "../../repository/db.repository";
import { UserFriendModel } from "./user-friend.model";

export class UserFriendRepository extends AbstractDBRepository<IUserFriends> {
  constructor() {
    super(UserFriendModel);
  }
}
