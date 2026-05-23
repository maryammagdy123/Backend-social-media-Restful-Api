import { GenderEnum, ProfilePrivacy, ProviderEnum, RoleEnum } from "../enums";

export interface IUser {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  coverPhotos?: string;
  bio?: string;
  DOB: Date;
  gender: GenderEnum;
  role: RoleEnum;
  provider: ProviderEnum;
  isConfirmed: boolean;
  profilePrivacy: ProfilePrivacy;
}

export interface IProfileStatistics {
  postsCount: number;
  friendsRequestsCount: number;
  friendsCount: number;
  likesCount: number;
  commentsCount:number
}
