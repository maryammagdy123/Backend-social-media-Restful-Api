"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../../middlewares");
const friend_request_service_1 = __importDefault(require("./friend-request.service"));
const mongoose_1 = require("mongoose");
const response_1 = require("../../common/response");
const router = (0, express_1.Router)();
router.post("/:receiverId", (0, middlewares_1.authenticateUser)("strict"), async (req, res, next) => {
    const data = await friend_request_service_1.default.sendRequest(req.user._id, new mongoose_1.Types.ObjectId(req.params.receiverId));
    (0, response_1.successResponse)({
        res,
        message: "Request sent successfully!",
        status: 201,
        data,
    });
});
router.post("/:id/accept", (0, middlewares_1.authenticateUser)("strict"), async (req, res, next) => {
    await friend_request_service_1.default.acceptRequest(req.user._id, new mongoose_1.Types.ObjectId(req.params.id));
    (0, response_1.successResponse)({
        res,
        message: "Request accepted successfully!",
        status: 200,
    });
});
router.delete("/:id/reject", (0, middlewares_1.authenticateUser)("strict"), async (req, res, next) => {
    await friend_request_service_1.default.rejectOrCancelRequest(req.user._id, new mongoose_1.Types.ObjectId(req.params.id));
    (0, response_1.successResponse)({
        res,
        message: "Request rejected successfully!",
        status: 200,
    });
});
router.get("/received", (0, middlewares_1.authenticateUser)("strict"), async (req, res, next) => {
    const data = await friend_request_service_1.default.getReceivedRequests(req.user._id);
    (0, response_1.successResponse)({
        res,
        message: "Received requests fetched successfully!",
        status: 200,
        data,
    });
});
exports.default = router;
