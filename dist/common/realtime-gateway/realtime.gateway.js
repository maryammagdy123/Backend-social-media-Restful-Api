"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeGateway = void 0;
const socket_io_1 = require("socket.io");
const services_1 = require("../services");
const config_1 = require("../../config");
const init_1 = require("../providers/cache/redis/init");
class RealtimeGateway {
    _io;
    token;
    cacheProvider;
    constructor(server) {
        this.token = new services_1.TokenService();
        this._io = new socket_io_1.Server(server, { cors: { origin: "*" } });
        this.cacheProvider = init_1.redisService;
    }
    establishConnection() {
        this._io.use((socket, next) => {
            try {
                const decoded = this.token.verifyToken(socket.handshake.auth.token, config_1.ACCESS_TOKEN_SECRET_KEY);
                socket.data = decoded;
                next();
            }
            catch (error) {
                next(error);
            }
        });
        this._io.on("connection", async (socket) => {
            console.log(`connected from  ${socket.id}`);
            const userId = socket.data.id;
            await this.cacheProvider.addToSet(`socketIds::${userId}`, socket.id);
            const socketIds = await this.cacheProvider.sMembers(`socketIds::${userId}`);
            console.log(socketIds, `for user ${userId}`);
            socket.on("disconnect", async () => {
                console.log(`Disconnected from ${socket.id}`);
                await this.cacheProvider.sRem(`socketIds::${userId}`, socket.id);
            });
        });
    }
    get io() {
        return this._io;
    }
}
exports.RealtimeGateway = RealtimeGateway;
