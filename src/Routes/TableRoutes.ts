import { Router } from "express";
import { IRouterConfig } from "../types/Server";
import Validation from "../middlewares/Validation";
import Resolve from "../helps/Resolve";
import Auth from "../middlewares/Auth";
import TableController from "../Controllers/TableController";

export default class TableRouter {
  public static route = "/";
  public router = Router();

  public routerConfig: IRouterConfig[] = [
    {
      method: "get",
      path: "/table",
      middlewares: [],
      handlers: this.getTable,
    },

    {
      method: "get",
      path: "/table/:id",
      middlewares: [],
      handlers: this.getTableById,
    },

    {
      method: "post",
      path: "/table/create",
      middlewares: [Auth],
      handlers: this.createTable,
    },

    {
      method: "post",
      path: "/table/join/:id",
      middlewares: [Auth],
      handlers: this.joinTable,
    },

    {
      method: "post",
      path: "/table/out",
      middlewares: [Auth],
      handlers: this.outTable,
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

  private async getTable(req: any, res: any) {
    try {
      const limit = req.query?.limit || 10;
      const offset = req.query?.offset || 0;
      const status = req.query?.status;
      const response = await TableController.getTable(limit, offset, status);
      response && response.status
        ? Resolve.ok(req, res, response.data)
        : Resolve.badRequest(req, res, response.data, response.msg || "");
    } catch (error: any) {
      Resolve.serverError(req, res, error);
    }
  }

  private async getTableById(req: any, res: any) {
    try {
      const tableId = req?.params?.id;
      if (!tableId) {
        Resolve.badRequest(req, res, [], "");
      }
      const response = await TableController.getTableById(tableId);
      response && response.status
        ? Resolve.ok(req, res, response.data)
        : Resolve.badRequest(req, res, response.data, response.msg || "");
    } catch (error: any) {
      Resolve.serverError(req, res, error);
    }
  }

  private async createTable(req: any, res: any) {
    try {
      const response = await TableController.createTable(
        req.headers.authorization,
        req.body
      );
      response && response.status
        ? Resolve.ok(req, res, response.data)
        : Resolve.badRequest(req, res, response.data, response.msg || "");
    } catch (error: any) {
      Resolve.serverError(req, res, error);
    }
  }

  private async joinTable(req: any, res: any) {
    try {
      const token = req.headers.authorization;
      const tableId = req?.params?.id;
      const response = await TableController.joinTable(
        token,
        tableId,
        req.body
      );
      response && response.status
        ? Resolve.ok(req, res, response.data)
        : Resolve.badRequest(req, res, response.data, response.msg || "");
    } catch (error: any) {
      Resolve.serverError(req, res, error);
    }
  }

  private async outTable(req: any, res: any) {
    try {
      const token = req.headers.authorization;
      const tableId = req?.params?.id;
      const response = await TableController.outTable(token, tableId);
      response && response.status
        ? Resolve.ok(req, res, response.data)
        : Resolve.badRequest(req, res, response.data, response.msg || "");
    } catch (error: any) {
      Resolve.serverError(req, res, error);
    }
  }
}
