import { NextFunction, Request, Response, Router } from "express";
import { authenticateUser } from "../../middlewares";
import { chatService } from "./chat.service";
import { Types } from "mongoose";
import { successResponse } from "../../common/response";
import { messageRouter } from "../message";

const router = Router();
router.use("/:chatId/message", messageRouter);
router.post(
  "/:friendId",
  authenticateUser("strict"),
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await chatService.createChat(
      new Types.ObjectId(req.params.friendId as string),
      new Types.ObjectId(req.user._id),
    );
    successResponse({ res, message: "done", status: 201, data: data });
  },
);
router.get(
  "/:friendId",
  authenticateUser("strict"),
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await chatService.getChat(
      new Types.ObjectId(req.params.friendId as string),
      new Types.ObjectId(req.user._id),
    );
    successResponse({ res, message: "done", status: 200, data: data });
  },
);

export default router;
