import { NextFunction, Request, Response, Router } from "express";
import { authenticateUser } from "../../middlewares";
import { messageService } from "./message.service";
import { Types } from "mongoose";
import { successResponse } from "../../common/response";

const router = Router({ mergeParams: true });

router.post(
  "/",
  authenticateUser("strict"),
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await messageService.sendMessage(
      new Types.ObjectId(req.params.chatId as string),
      new Types.ObjectId(req.user._id),
      req.body.content,
    );
    successResponse({ res, message: "message sent", status: 201, data: data });
  },
);
export default router;
