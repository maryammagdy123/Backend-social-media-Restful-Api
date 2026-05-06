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
router.post(
  "/:id/accept",
  authenticateUser("strict"),
  async (req: Request, res: Response, next: NextFunction) => {
    await requestService.acceptRequest(
      req.user._id,

      new Types.ObjectId(req.params.id as string),
    );
    successResponse({
      res,
      message: "Request accepted successfully!",
      status: 200,
    });
  },
);
router.delete(
  "/:id/reject",
  authenticateUser("strict"),
  async (req: Request, res: Response, next: NextFunction) => {
    await requestService.rejectOrCancelRequest(
      req.user._id,
      new Types.ObjectId(req.params.id as string),
    );
    successResponse({
      res,
      message: "Request rejected successfully!",
      status: 200,
    });
  },
);

export default router;
