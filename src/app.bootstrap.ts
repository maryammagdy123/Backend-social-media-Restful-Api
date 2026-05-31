import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import {
  authRouter,
  chatRouter,
  commentRouter,
  friendRouter,
  postRouter,
  requestRouter,
  schema,
} from "./modules";
import { globalErrorHandler } from "./middlewares";
import { authenticateDB } from "./DB";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./modules/user";
import { redisService } from "./common/providers/cache/redis/init";
import { createHandler } from "graphql-http/lib/use/express";

import { RealtimeGateway } from "./common";

const bootstrap = async () => {
  console.log("Bootstrapping the application...");
  const app: express.Express = express();
  await authenticateDB();
  await redisService.connect();
  app.use(express.json());
  app.use(cookieParser());
  //cors
  app.use(
    cors({
      origin: "*",
      credentials: true,
    }),
  );

  app.all(
    "/graphql",
    createHandler({ schema: schema, context: (req) => ({ req }) }),
  );
  app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json("Hello, World!");
  });
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/post", postRouter);
  app.use("/request", requestRouter);
  app.use("/friend", friendRouter);
  app.use("/comment", commentRouter);
  app.use("/chat", chatRouter);
  app.get("/*dummy", (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json("Not Found");
  });
  app.use(globalErrorHandler);
  const httpServer = app.listen(3000, () => {
    console.log("Application is listening on port 3000");
  });
  const realtimeGateway = new RealtimeGateway(httpServer);
  realtimeGateway.establishConnection();
};
export default bootstrap;
