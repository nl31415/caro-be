import jwt from "jsonwebtoken";
import Locals from "../providers/Locals";

export const getUserId = async (token: string) => {
  let decode: any = await jwt.verify(token, Locals.config().appSecret);
  if (!decode.userId) {
    return false;
  }
  
  return decode.userId;
};
