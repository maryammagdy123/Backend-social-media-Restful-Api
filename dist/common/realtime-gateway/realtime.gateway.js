"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeGateway = void 0;
const socket_io_1 = require("socket.io");
class RealtimeGateway {
    _io;
    constructor(server) {
        this._io = new socket_io_1.Server(server, { cors: { origin: "*" } });
    }
    get io() {
        this._io.on("connection", (socket) => {
            console.log(`connected from  ${socket.id}`);
            socket.on("disconnect", () => {
                console.log(`Disconnected from ${socket.id}`);
            });
        });
        return this._io;
    }
}
exports.RealtimeGateway = RealtimeGateway;
