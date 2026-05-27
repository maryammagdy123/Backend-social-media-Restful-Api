import Router, { Request, Response, NextFunction } from "express";
import { userService } from "./user.service";

import { authenticateUser } from "../../middlewares";
import { Types } from "mongoose";
import { successResponse } from "../../common/response";
import { feedService } from "../feed/feed.service";

const router = Router();
router.post(
  "/logout",
  authenticateUser("strict"),
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) return res.sendStatus(204);
    await userService.sessionLogout(refreshToken);
    res.clearCookie("refreshToken", {
      path: "/",
    });

    return res.sendStatus(204);
  },
);

router.post(
  "/logout/all",
  authenticateUser("strict"),
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) return res.sendStatus(204);
    await userService.logoutAllSessions(refreshToken);
    res.clearCookie("refreshToken", {
      path: "/",
    });

    return res.sendStatus(204);
  },
);

//todo get user friends list
//todo get user blocked list
//todo get user friend requests
//todo get users profile(includes posts)
router.get(
  "/profile/:userId",
  authenticateUser("optional"),
  async (req: Request, res: Response, next: NextFunction) => {
    const { posts, user } = await userService.getUserProfile(
      new Types.ObjectId(req.params.userId as string),
      req.user ? req.user._id : null,
      {
        limit: Number(req.query.limit),
        page: Number(req.query.page),
        search: req.query.search as string,
      },
    );

    successResponse({
      res,
      message: "User profile retrieved successfully",
      data: { user, posts },
    });
  },
);
router.get(
  "/me/profile",
  authenticateUser("strict"),
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await userService.myProfile(
   req.user._id,
    );
  successResponse({
      res,
      message: "User profile retrieved successfully",
      data,
    });

  },
);

router.get(
  "/feed",
  authenticateUser("strict"),
  async (req: Request, res: Response, next: NextFunction) => {
    const feed = await feedService.getUserFeed(req.user, {
      limit: Number(req.query.limit),
      page: Number(req.query.page),
    });
    successResponse({
      res,
      message: "feed",
      data: {
        "posts-feed": feed.posts,
        comments: feed.comments,
        reactions: feed.reactions,
      },
    });
  },
);
export default router;
