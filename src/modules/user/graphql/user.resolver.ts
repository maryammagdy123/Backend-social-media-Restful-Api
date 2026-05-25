import { Types } from "mongoose";
import { TokenService } from "../../../common";
// import { BadRequestError } from "../../../common/exceptions";
// import { ACCESS_TOKEN_SECRET_KEY } from "../../../config";
import { userService, UserService } from "../user.service";
import { ACCESS_TOKEN_SECRET_KEY } from "../../../config";
import { BadRequestError } from "../../../common/exceptions";
import { decode } from "node:punycode";
interface IFriendProfileArgs {
  page?: number;
  limit?: number;
  search?: string;
  profileOwnerID: string;
}
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  //make all resolvers arrow functions to bind this to the class instance
  getMyProfile = async (parent: unknown, args: any, context: any) => {
    // logic
    const decoded = this.tokenService.verifyToken(
      context.req.headers.authorization,
      ACCESS_TOKEN_SECRET_KEY as string,
    );
    // console.log(decoded)
    if (!decoded) throw new BadRequestError("Token is required");

    const userId =decoded.id ;
    // console.log(userId)

    const profile = await this.userService.myProfile(userId);
    // console.log({ profile });
    return { ...profile, message: "done" };
  };

  getFriendProfile = async (
    parent: unknown,
    args: { input: IFriendProfileArgs },
    context: any,
  ) => {

     // logic
    const decoded = this.tokenService.verifyToken(
      context.req.headers.authorization,
      ACCESS_TOKEN_SECRET_KEY as string,
    );
    // console.log(decoded)
    if (!decoded) throw new BadRequestError("Token is required");
    const viewerId = new Types.ObjectId(decoded.id);
    console.log(typeof viewerId)
    console.log(args.input.profileOwnerID);
    const profile = await this.userService.getUserProfile(
      new Types.ObjectId(args.input.profileOwnerID),
      viewerId,
      {
        limit: args.input.limit as number,
        page: args.input.page as number,
        search: args.input.search as string,
      },
    );
    console.log(profile);
    return { data: profile, message: "done ", status: 200 };
  };
}
export const userResolver = new UserResolver(userService, new TokenService());
//act as controller for GraphQL requests related to user, it will call the service methods and return the response to the client
