"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_service_1 = require("./user.service");
const middlewares_1 = require("../../middlewares");
const mongoose_1 = require("mongoose");
const response_1 = require("../../common/response");
const feed_service_1 = require("../feed/feed.service");
const router = (0, express_1.default)();
router.post("/logout", (0, middlewares_1.authenticateUser)("strict"), async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken)
        return res.sendStatus(204);
    await user_service_1.userService.sessionLogout(refreshToken);
    res.clearCookie("refreshToken", {
        path: "/",
    });
    return res.sendStatus(204);
});
router.post("/logout/all", (0, middlewares_1.authenticateUser)("strict"), async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken)
        return res.sendStatus(204);
    await user_service_1.userService.logoutAllSessions(refreshToken);
    res.clearCookie("refreshToken", {
        path: "/",
    });
    return res.sendStatus(204);
});
router.get("/profile/:userId", (0, middlewares_1.authenticateUser)("optional"), async (req, res, next) => {
    const { posts, user } = await user_service_1.userService.getUserProfile(new mongoose_1.Types.ObjectId(req.params.userId), req.user ? req.user._id : null, {
        limit: Number(req.query.limit),
        page: Number(req.query.page),
        search: req.query.search,
    });
    (0, response_1.successResponse)({
        res,
        message: "User profile retrieved successfully",
        data: { user, posts },
    });
});
router.get("/me/profile", (0, middlewares_1.authenticateUser)("strict"), async (req, res, next) => {
    const data = await user_service_1.userService.myProfile(req.user._id);
    (0, response_1.successResponse)({
        res,
        message: "User profile retrieved successfully",
        data,
    });
});
router.get("/feed", (0, middlewares_1.authenticateUser)("strict"), async (req, res, next) => {
    const feed = await feed_service_1.feedService.getUserFeed(req.user, {
        limit: Number(req.query.limit),
        page: Number(req.query.page),
    });
    (0, response_1.successResponse)({
        res,
        message: "feed",
        data: {
            "posts-feed": feed.posts,
            comments: feed.comments,
            reactions: feed.reactions,
        },
    });
});
exports.default = router;
