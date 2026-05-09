"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const common_1 = require("../../common");
const init_1 = require("../../common/providers/cache/redis/init");
const exceptions_1 = require("../../common/exceptions");
const config_1 = require("../../config");
const DB_1 = require("../../DB");
class UserService {
    tokenService;
    userRepo;
    postRepo;
    constructor(tokenService, userRepo, postRepo) {
        this.tokenService = tokenService;
        this.userRepo = userRepo;
        this.postRepo = postRepo;
    }
    sessionLogout = async (token) => {
        const decoded = this.tokenService.verifyToken(token, config_1.REFRESH_TOKEN_SECRET_KEY);
        const deleted = await init_1.redisService.delete(init_1.redisService.sessionKey(decoded?.id, decoded?.sessionId));
        if (!(await init_1.redisService.sRem(init_1.redisService.allSessionsSetKey(decoded?.id), decoded?.sessionId))) {
            throw new exceptions_1.NotFoundError("session already expired");
        }
        if (!deleted) {
            throw new exceptions_1.BadRequestError("Something went wrong, already  logged out !");
        }
        return true;
    };
    logoutAllSessions = async (token) => {
        const decoded = this.tokenService.verifyToken(token, config_1.REFRESH_TOKEN_SECRET_KEY);
        const userId = decoded?.id;
        const sessions = await init_1.redisService.sMembers(init_1.redisService.allSessionsSetKey(userId));
        await Promise.all(sessions.map((sessionId) => init_1.redisService.sRem(init_1.redisService.allSessionsSetKey(userId), sessionId)));
        return true;
    };
    getUserProfile = async (userId) => {
        const user = await this.userRepo.findById(userId, { username: 1, profilePicture: 1, });
        if (!user)
            throw new exceptions_1.NotFoundError("User not found");
        const posts = await this.postRepo.find({ userId });
        return { user, posts };
    };
}
exports.UserService = UserService;
exports.userService = new UserService(new common_1.TokenService(), new DB_1.UserRepository(), new DB_1.PostRepository());
