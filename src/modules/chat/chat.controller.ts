import { NextFunction, Request, Response, Router } from "express";
import { authenticateUser } from "../../middlewares";
import { chatService } from "./chat.service";
import { Types } from "mongoose";
import { successResponse } from "../../common/response";

const router = Router();

router.get(
  "/:friendId",
  authenticateUser("strict"),
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await chatService.getChat(
        new Types.ObjectId("69e3aa693656f7fe0d965877"),
      new Types.ObjectId("69e27341ee913e6ba48dcef0"),

    );
    successResponse({ res, message: "done", status: 200, data: data });
  },
);

export default router;
