import { Router } from "express";
import TableRouter from "./TableRoutes";
import UserRouter from "./UserRoutes";

export class BaseRoutes {
  public static mountApiV1(__app: Router) {
    // Base url config
    const base = `/caro`;
    // Init all routes version 1.0
    __app.use(base + UserRouter.route, new UserRouter().router);
    __app.use(base + TableRouter.route, new TableRouter().router);
  }

  public static mountApiV2(__app: Router) {}
}
