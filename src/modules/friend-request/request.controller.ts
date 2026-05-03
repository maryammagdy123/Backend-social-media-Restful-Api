import { NextFunction, Request, Response, Router } from "express";
import { authenticateUser } from "../../middlewares";
import requestService from "./request.service";
import { Types } from "mongoose";
import { successResponse } from "../../common/response";

const router = Router();
router.post(
  "/:receiverId",
  authenticateUser("strict"),
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await requestService.sendRequest(
      req.user._id,
      new Types.ObjectId(req.params.receiverId as string),
    );
    successResponse({
      res,
      message: "Request sent successfully!",
      status: 201,
      data,
    });
  },
);
export default router;
