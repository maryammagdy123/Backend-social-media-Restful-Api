"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../../middlewares");
const chat_service_1 = require("./chat.service");
const mongoose_1 = require("mongoose");
const response_1 = require("../../common/response");
const router = (0, express_1.Router)();
console.log("CHAT ROUTER LOADED");
router.post("/:friendId", (0, middlewares_1.authenticateUser)("strict"), async (req, res, next) => {
    const data = await chat_service_1.chatService.createChat(new mongoose_1.Types.ObjectId(req.params.friendId), new mongoose_1.Types.ObjectId(req.user._id));
    (0, response_1.successResponse)({ res, message: "done", status: 201, data: data });
});
router.get("/:friendId", (0, middlewares_1.authenticateUser)("strict"), async (req, res, next) => {
    const data = await chat_service_1.chatService.getChat(new mongoose_1.Types.ObjectId(req.params.friendId), new mongoose_1.Types.ObjectId(req.user._id));
    (0, response_1.successResponse)({ res, message: "done", status: 200, data: data });
});
exports.default = router;
