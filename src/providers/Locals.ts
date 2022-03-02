import { Application } from "express";
import { ILocals } from "../types/Server";

import * as path from "path";
import dotenv from "dotenv";

class Locals {
  /**
   * Makes env configs available for your app
   * throughout the app's runtime
   */
  public static config(): ILocals {
    dotenv.config({ path: path.join(__dirname, "../../.env") });

    const port = process.env.PORT || 8000;
    const host = "localhost";
    const appSecret = process.env.APP_SECRET || "n31415";
    const dbUrl = process.env.DB_URL || "mongodb:localhost:27017";
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";
    const url = `http://${host}:${port}`;

    const isCORSEnabled = true;

    return {
      appSecret,
      port,
      host,
      url,
      dbUrl,
      isCORSEnabled,
      jwtExpiresIn,
    };
  }

  /**
   * Injects your config to the app's locals
   */
  public static init(_express: Application): Application {
    _express.locals.app = this.config();
    return _express;
  }
}

export default Locals;
