import {
  IUser,
  PaginateDTO,
  ProfilePrivacy,
  TokenService,
  UserDocument,
} from "../../common";
import { redisService } from "../../common/providers/cache/redis/init";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../common/exceptions";
import { REFRESH_TOKEN_SECRET_KEY } from "../../config";
import { Types } from "mongoose";
import {
  CommentRepository,
  PostRepository,
  UserFriendRepository,
  UserReactionRepository,
  UserRepository,
} from "../../DB";
import { BlockRepository } from "../../DB/models/block/block.repository";
import { IProfileResponse } from "./user.entities";
import { RequestRepository } from "../../DB/models/friend-request";

export class UserService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepo: UserRepository,
    private readonly postRepo: PostRepository,
    private readonly friendsRepo: UserFriendRepository,
    private readonly blockRepo: BlockRepository,
    private readonly reactionRepo: UserReactionRepository,
    private readonly requestRepo: RequestRepository,
    private readonly commentRepo: CommentRepository,
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
  /**
   * userId is the profile owner
   * viewerId is the person who is logged in
   */
  public getUserProfile = async (
    profileOwnerId: Types.ObjectId,
    viewerId: Types.ObjectId | null,
    paginateDTO: PaginateDTO,
  ) => {
    // 1) get user
    const user = await this.userRepo.findById(profileOwnerId, {
      username: 1,
      profilePicture: 1,
      bio: 1,
      coverPhotos: 1,
      profilePrivacy: 1,
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // 2) check block
    if (viewerId) {
      const isBlocked = await this.blockRepo.findOne({
        user: viewerId,
        blockedBy: user._id,
      });

      if (isBlocked) {
        throw new NotFoundError("User not found");
      }
    }

    // 3) privacy check
    //profile is protected and the viewer is a friend
    const isOwner = viewerId && viewerId.equals(profileOwnerId);

    if (user.profilePrivacy === ProfilePrivacy.PROTECTED && !isOwner) {
      const isFriend = await this.friendsRepo.findOne({
        $or: [
          { user: viewerId, friend: profileOwnerId },
          { user: profileOwnerId, friend: viewerId },
        ],
      });

      if (!isFriend) {
        throw new ForbiddenError(
          "This profile is protected, only friends can view it",
        );
      }
    }

    // 4) pagination defaults
    const { page = 1, limit = 10, search = "" } = paginateDTO || {};
    const skip = (page - 1) * limit;

    // 5) posts query
    const posts = await this.postRepo
      .find({ userId: profileOwnerId })
      .populate("userId", "username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return { user, posts };

    // profile is public [private posts , public posts ] show public posts for all

  };

  public myProfile = async (me: Types.ObjectId): Promise<IProfileResponse> => {
    // console.log("me",me)
    const [user, posts, friends, likes, requests, comments] = await Promise.all(
      [
        this.userRepo.findById(me),
        this.postRepo.find({ userId: me }),
        this.friendsRepo
          .find({
            $or: [{ user: me }, { friend: me }],
          })
          .populate<{ user: UserDocument; friend: IUser }>(["user", "friend"]),
        this.reactionRepo.find({ userId: me }).countDocuments(),
        this.requestRepo.find({ receiver: me }).countDocuments(),
        this.commentRepo.find({ userId: me }).countDocuments(),
      ],
    );
    // console.log(user)
    return {
      userProfile: user!,
      posts,
      friends: friends.map((f) => {
        return f.user._id.toString() === me.toString() ? f.friend : f.user;
      }),
      statistics: {
        friendsCount: friends.length,
        postsCount: posts.length,
        likesCount: likes,
        friendsRequestsCount: requests,
        commentsCount: comments,
      },
    };
  };
}
export const userService = new UserService(
  new TokenService(),
  new UserRepository(),
  new PostRepository(),
  new UserFriendRepository(),
  new BlockRepository(),
  new UserReactionRepository(),
  new RequestRepository(),
  new CommentRepository(),
);
