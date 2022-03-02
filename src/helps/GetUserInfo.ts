import { UserModel } from "../Models/UserModel";

export const getUserInfo = async (userId: string) => {
  let user = await UserModel.findById(userId);
  if (!userId) {
    return false;
  }
  return user;
};
