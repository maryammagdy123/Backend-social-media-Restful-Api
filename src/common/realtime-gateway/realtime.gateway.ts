import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "node:http";
export class RealtimeGateway {
  //establish connection with socket.io

  private _io: Server;
  constructor(server: HttpServer) {
    this._io = new Server(server, { cors: { origin: "*" } });
  }

  public get io(): Server {
    //check connection
    this._io.on("connection", (socket: Socket) => {
      console.log(`connected from  ${socket.id}`);

      //todo : assign socket.ids to their authenticated (login user)user into cache

      socket.on("disconnect", () => {
        //todo:remove closed assigned socket.id from cache
        console.log(`Disconnected from ${socket.id}`);
      });
    });
    return this._io;
  }
}
