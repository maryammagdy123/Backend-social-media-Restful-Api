import { TokenService } from "../../../common";
import { BadRequestError } from "../../../common/exceptions";
import { ACCESS_TOKEN_SECRET_KEY } from "../../../config";
import { userService, UserService } from "../user.service";

export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  //make all resolvers arrow functions to bind this to the class instance
  getMyProfile = async (parent: unknown, args: any, context: any) => {
    //logic
    const decoded = this.tokenService.verifyToken(
      context.req.headers.authorization,
      ACCESS_TOKEN_SECRET_KEY as string,
    );
    // console.log(decoded)
    if (!decoded) throw new BadRequestError("Token is required");
    const profile = await this.userService.myProfile(decoded.id);
    console.log({profile})
    return {...profile ,message:"done"};
  };
}
export const userResolver = new UserResolver(userService, new TokenService());
//act as controller for GraphQL requests related to user, it will call the service methods and return the response to the client
