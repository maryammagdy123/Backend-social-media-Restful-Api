"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const modules_1 = require("./modules");
const middlewares_1 = require("./middlewares");
const DB_1 = require("./DB");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_1 = require("./modules/user");
const init_1 = require("./common/providers/cache/redis/init");
const express_2 = require("graphql-http/lib/use/express");
const bootstrap = async () => {
    console.log("Bootstrapping the application...");
    const app = (0, express_1.default)();
    await (0, DB_1.authenticateDB)();
    await init_1.redisService.connect();
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.use((0, cors_1.default)({
        origin: "http://localhost:5173",
        credentials: true,
    }));
    app.all("/graphql", (0, express_2.createHandler)({ schema: modules_1.schema, context: (req) => ({ req }) }));
    app.get("/", (req, res, next) => {
        res.status(200).json("Hello, World!");
    });
    app.use("/auth", modules_1.authRouter);
    app.use("/user", user_1.userRouter);
    app.use("/post", modules_1.postRouter);
    app.use("/request", modules_1.requestRouter);
    app.use("/friend", modules_1.friendRouter);
    app.use("/comment", modules_1.commentRouter);
    app.get("/*dummy", (req, res, next) => {
        res.status(404).json("Not Found");
    });
    app.use(middlewares_1.globalErrorHandler);
    app.listen(3000, () => {
        console.log("Application is listening on port 3000");
    });
};
exports.default = bootstrap;
