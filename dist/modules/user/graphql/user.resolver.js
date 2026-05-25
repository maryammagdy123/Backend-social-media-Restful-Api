"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolver = exports.UserResolver = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../../../common");
const user_service_1 = require("../user.service");
const config_1 = require("../../../config");
const exceptions_1 = require("../../../common/exceptions");
class UserResolver {
    userService;
    tokenService;
    constructor(userService, tokenService) {
        this.userService = userService;
        this.tokenService = tokenService;
    }
    getMyProfile = async (parent, args, context) => {
        const decoded = this.tokenService.verifyToken(context.req.headers.authorization, config_1.ACCESS_TOKEN_SECRET_KEY);
        if (!decoded)
            throw new exceptions_1.BadRequestError("Token is required");
        const userId = decoded.id;
        const profile = await this.userService.myProfile(userId);
        return { ...profile, message: "done" };
    };
    getFriendProfile = async (parent, args, context) => {
        const decoded = this.tokenService.verifyToken(context.req.headers.authorization, config_1.ACCESS_TOKEN_SECRET_KEY);
        if (!decoded)
            throw new exceptions_1.BadRequestError("Token is required");
        const viewerId = new mongoose_1.Types.ObjectId(decoded.id);
        console.log(typeof viewerId);
        console.log(args.input.profileOwnerID);
        const profile = await this.userService.getUserProfile(new mongoose_1.Types.ObjectId(args.input.profileOwnerID), viewerId, {
            limit: args.input.limit,
            page: args.input.page,
            search: args.input.search,
        });
        console.log(profile);
        return { data: profile, message: "done ", status: 200 };
    };
}
exports.UserResolver = UserResolver;
exports.userResolver = new UserResolver(user_service_1.userService, new common_1.TokenService());
