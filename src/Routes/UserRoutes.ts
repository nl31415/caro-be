import { Router } from "express";
import UserController from "../Controllers/UserController";
import { IRouterConfig } from "../types/Server";
import Validation from "../middlewares/Validation";
import { UserCreateBody } from "../Models/UserModel";
import Resolve from "../helps/Resolve";
import Auth from "../middlewares/Auth";
import { getUserId } from "../helps/GetUserId";

export default class UserRouter {
  public static route = "/";
  public router = Router();

  public routerConfig: IRouterConfig[] = [
    {
      method: "get",
      path: "/user/info/:id",
      middlewares: [Auth],
      handlers: this.getUserInfo,
    },

    {
      method: "get",
      path: "/user/info/",
      middlewares: [Auth],
      handlers: this.getMyInfo,
    },

    {
      method: "post",
      path: "/user/create",
      middlewares: [Validation(UserCreateBody)],
      handlers: this.createUser,
    },

    {
      method: "post",
      path: "/login",
      middlewares: [],
      handlers: this.login,
    },

    {
      method: "post",
      path: "/logout",
      middlewares: [Auth],
      handlers: this.logout,
    },
  ];

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.routerConfig.forEach((router) => {
      this.router[router.method](
        router.path,
        router.middlewares,
        router.handlers
      );
    });
  }

  private async getUserInfo(req: any, res: any) {
    try {
      const uid = req?.params?.id;
      const response = await UserController.getUserInfo(uid);
      response && response.status
        ? Resolve.ok(req, res, response.data)
        : Resolve.badRequest(req, res, response.data, response.msg || "");
    } catch (error: any) {
      Resolve.serverError(req, res, error);
    }
  }

  private async getMyInfo(req: any, res: any) {
    try {
      const token = req.headers.authorization;
      const uid = await getUserId(token);
      const response = await UserController.getUserInfo(uid);
      response && response.status
        ? Resolve.ok(req, res, response.data)
        : Resolve.badRequest(req, res, response.data, response.msg || "");
    } catch (error: any) {
      Resolve.serverError(req, res, error);
    }
  }

  private async createUser(req: any, res: any) {
    try {
      const body = req.body;
      const response = await UserController.createUser(body);
      response && response.status
        ? Resolve.ok(req, res, response.data)
        : Resolve.badRequest(req, res, response.data, response.msg || "");
    } catch (error: any) {
      Resolve.serverError(req, res, error);
    }
  }

  private async login(req: any, res: any) {
    try {
      const body = req.body;
      const response = await UserController.login(body);
      response && response.status
        ? Resolve.ok(req, res, response.data)
        : Resolve.badRequest(req, res, response.data, response.msg || "");
    } catch (error: any) {
      Resolve.serverError(req, res, error);
    }
  }

  private async logout(req: any, res: any) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        Resolve.badRequest(req, res, [], "Có lỗi xảy ra");
      }
      const response = await UserController.logout(token);
      response && response.status
        ? Resolve.ok(req, res, response.data)
        : Resolve.badRequest(req, res, response.data, response.msg || "");
    } catch (error: any) {
      Resolve.serverError(req, res, error);
    }
  }
}
