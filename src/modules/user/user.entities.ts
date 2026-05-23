import { IPost, IProfileStatistics, IUser } from "../../common";

export interface IProfileResponse {
  userProfile: IUser;
  posts: IPost[];
  friends: IUser[];
  statistics: IProfileStatistics;
}
