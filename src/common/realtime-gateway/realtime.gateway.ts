import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "node:http";
import { TokenService } from "../services";
import { ACCESS_TOKEN_SECRET_KEY } from "../../config";
import { ICacheProvider } from "../providers/cache/cache.interface";
import { redisService } from "../providers/cache/redis/init";
export class RealtimeGateway {
  //establish connection with socket.io

  private _io: Server;
  private readonly token: TokenService;
  private readonly cacheProvider: ICacheProvider;
  constructor(server: HttpServer) {
    this.token = new TokenService();
    this._io = new Server(server, { cors: { origin: "*" } });
    this.cacheProvider = redisService;
  }
//integrate with cache provider to store socket id for the logged in user
  public establishConnection() {
    this._io.use((socket: Socket, next: any) => {
      try {
        const decoded = this.token.verifyToken(
          socket.handshake.auth.token,
          ACCESS_TOKEN_SECRET_KEY as string,
        );
        socket.data = decoded;
        next();
      } catch (error) {
        next(error);
      }
    });
    //check connection
    this._io.on("connection", async (socket: Socket) => {
      console.log(`connected from  ${socket.id}`);
      //todo : assign socket.ids to their authenticated (login user)user into cache
      const userId = socket.data.id;
      await this.cacheProvider.addToSet(`socketIds::${userId}`, socket.id);
      const socketIds = await this.cacheProvider.sMembers(
        `socketIds::${userId}`,
      );
      console.log(socketIds, `for user ${userId}`);
      socket.on("disconnect", async () => {
        //todo:remove closed assigned socket.id from cache
        console.log(`Disconnected from ${socket.id}`);
        await this.cacheProvider.sRem(`socketIds::${userId}`, socket.id);
      });
    });
  }
  public get io(): Server {
    return this._io;
  }
}
