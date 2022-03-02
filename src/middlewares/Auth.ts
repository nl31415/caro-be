import jwt from "jsonwebtoken";
import Resolve from "../helps/Resolve";
import Locals from "../providers/Locals";
import { UserModel } from "../Models/UserModel";

import { INextFunction, IRequest, IResponse } from "../types/Server";

async function Auth(req: IRequest, res: IResponse, next: INextFunction) {
  try {
    // check token
    let token = req.headers.authorization;
    if (!token) {
      return Resolve.unauthorized(req, res, "Xác thực người dùng lỗi");
    }

    // decode token
    let decode: any = await jwt.verify(token, Locals.config().appSecret);
    if (!decode.userId) {
      return Resolve.unauthorized(req, res, "Xác thực người dùng lỗi");
    }

    // check db
    let user = await UserModel.findById(decode.userId);
    if (!user) {
      return Resolve.unauthorized(req, res, "Xác thực người dùng lỗi");
    }

    if (!user.token) {
      return Resolve.unauthorized(req, res, "Xác thực người dùng lỗi");
    }

    // thanh cong
    next();
  } catch (error) {
    Resolve.unauthorized(req, res, "Xác thực người dùng lỗi");
  }
}

export default Auth;
