import { NextFunction, Request, Response, Router } from "express";
import { authenticateUser } from "../../middlewares";
import { Types } from "mongoose";
import userFriendsService from "./user-friends.service";

const router = Router();
//unfriend endpoint
router.delete(
  "/:id",
  authenticateUser("strict"),
  async (req: Request, res: Response, next: NextFunction) => {
    await userFriendsService.unfriend(
      req.user._id,
      new Types.ObjectId(req.params.id as string),
    );
    return res.sendStatus(204);
  },
);
//block endpoint
router.post(
  "/block/:id",
  authenticateUser("strict"),
  async (req: Request, res: Response, next: NextFunction) => {
    await userFriendsService.block(
      new Types.ObjectId(req.params.id as string),
      req.user._id,
    );
    return res.sendStatus(204);
  },
);
export default router;
