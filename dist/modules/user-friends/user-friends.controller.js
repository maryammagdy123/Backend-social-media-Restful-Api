"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../../middlewares");
const mongoose_1 = require("mongoose");
const user_friends_service_1 = __importDefault(require("./user-friends.service"));
const router = (0, express_1.Router)();
router.delete("/:id", (0, middlewares_1.authenticateUser)("strict"), async (req, res, next) => {
    await user_friends_service_1.default.unfriend(req.user._id, new mongoose_1.Types.ObjectId(req.params.id));
    return res.sendStatus(204);
});
exports.default = router;
