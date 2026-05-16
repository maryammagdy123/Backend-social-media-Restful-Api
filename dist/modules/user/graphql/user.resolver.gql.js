"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolver = exports.UserResolver = void 0;
const user_service_1 = require("../user.service");
class UserResolver {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    getMyProfile = async (parent, args, context) => {
        const profile = await this.userService.myProfile(context.userId);
        return profile;
    };
}
exports.UserResolver = UserResolver;
exports.userResolver = new UserResolver(user_service_1.userService);
