import { IPost, IUser, IUserFriends } from "../../common";

export interface IProfileResponse {
  userProfile: IUser;
  posts: IPost[];
  friends: IUser[];
}
