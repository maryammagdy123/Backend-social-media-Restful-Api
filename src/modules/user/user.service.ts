import { TokenService } from "../../common";
import { redisService } from "../../common/providers/cache/redis/init";
import { BadRequestError, NotFoundError } from "../../common/exceptions";
import { REFRESH_TOKEN_SECRET_KEY } from "../../config";
import { Types } from "mongoose";
import { PostRepository, UserRepository } from "../../DB";
export class UserService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepo: UserRepository,
    private readonly postRepo: PostRepository,
  ) {}

  public sessionLogout = async (token: string) => {
    const decoded = this.tokenService.verifyToken(
      token,
      REFRESH_TOKEN_SECRET_KEY as string,
    );

    const deleted = await redisService.delete(
      redisService.sessionKey(decoded?.id, decoded?.sessionId),
    );
    if (
      !(await redisService.sRem(
        redisService.allSessionsSetKey(decoded?.id),
        decoded?.sessionId,
      ))
    ) {
      throw new NotFoundError("session already expired");
    }
    if (!deleted) {
      throw new BadRequestError("Something went wrong, already  logged out !");
    }
    return true;
  };

  public logoutAllSessions = async (token: string) => {
    const decoded = this.tokenService.verifyToken(
      token,
      REFRESH_TOKEN_SECRET_KEY as string,
    );

    const userId = decoded?.id;

    // delete all set that contains all users devices sessions
    const sessions = await redisService.sMembers(
      redisService.allSessionsSetKey(userId),
    );
    await Promise.all(
      sessions.map((sessionId) =>
        redisService.sRem(redisService.allSessionsSetKey(userId), sessionId),
      ),
    );
    return true;
  };
  //this should return users data and published posts
  public getUserProfile = async (userId: Types.ObjectId) => {
    /**
     * get all user data
     * todo check if user profile is private or public
     * if private check if the user is a friend of the profile owner or not
     * if not a friend return only public data and posts
     */


    const user = await this.userRepo.findById(userId,{username:1,profilePicture:1,});
    if (!user) throw new NotFoundError("User not found");
    //get all user posts
    const posts = await this.postRepo.find({ userId });
    return { user, posts };
  };
}
export const userService = new UserService(
  new TokenService(),
  new UserRepository(),
  new PostRepository(),
);
