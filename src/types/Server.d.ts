import { Request, Response, NextFunction } from "express";

export interface IRequest extends Request {
  // Define
}

export interface IResponse extends Response {
  // Define
}

export interface INextFunction extends NextFunction {
  // Define
}

export interface IRouterConfig {
  method: "get" | "post" | "put" | "delete";
  path: string;
  middlewares: any[];
  handlers: any;
}

export interface ILocals {
  appSecret: string;
  port: string | number;
  host: string;
  url: string;
  dbUrl: string;
  jwtExpiresIn: string | number;
  isCORSEnabled: boolean;
}
