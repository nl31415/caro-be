import cors from "cors";
import express from "express";

import Locals from "../providers/Locals";
import { BaseRoutes } from "../Routes/BaseRoute";
import { createServer } from "http";
import { Server } from "socket.io";
import { onConnect } from "../Socket/OnEvent";
class Express {
  /**
   * Create the express object
   */
  public express: express.Application;

  /**
   * Initializes the express server
   */
  constructor() {
    this.express = express();
    this.mountDotEnv();
  }

  // Mounts env
  private mountDotEnv(): void {
    this.express = Locals.init(this.express);
  }

  //Starts the express server
  public init(): any {
    // Start the server on the specified port
    const port = Locals.config().port;
    this.express.use(express.json());
    // cors
    const options: cors.CorsOptions = {
      origin: "*",
    };
    this.express.use(cors(options));

    // socket
    const httpServer = createServer(this.express);
    const io = new Server(httpServer, {
      cors: { origin: "*" },
    });
    onConnect(io);

    BaseRoutes.mountApiV1(this.express);
    httpServer.listen(port, () => {
      return console.log(`Listening on port ${port}`);
    });
  }
}

/** Export the express module */
export default new Express();
