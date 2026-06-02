"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../../middlewares");
const message_service_1 = require("./message.service");
const mongoose_1 = require("mongoose");
const response_1 = require("../../common/response");
const router = (0, express_1.Router)({ mergeParams: true });
router.post("/", (0, middlewares_1.authenticateUser)("strict"), async (req, res, next) => {
    const data = await message_service_1.messageService.sendMessage(new mongoose_1.Types.ObjectId(req.params.chatId), new mongoose_1.Types.ObjectId(req.user._id), req.body.content);
    (0, response_1.successResponse)({ res, message: "message sent", status: 201, data: data });
});
exports.default = router;
