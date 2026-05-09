import Router, { Request, Response, NextFunction } from "express";
import { userService } from "./user.service";

import { authenticateUser } from "../../middlewares";
import { Types } from "mongoose";
import { successResponse } from "../../common/response";

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
      req.user ? req.user._id : null
    );

    successResponse({
      res,
      message: "User profile retrieved successfully",
      data: { user, posts },
    });
  },
);
export default router;
