import { UserCreateBody, UserModel } from "../Models/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Locals from "../providers/Locals";
class UserController {
  public static async getUserInfo(id: string) {
    let user = await UserModel.findById(id);
    if (user) {
      return {
        status: true,
        data: user,
      };
    }
    return {
      status: false,
      data: [],
      msg: "User không tồn tại",
    };
  }

  public static async createUser(body: UserCreateBody) {
    let user = await UserModel.findOne({
      username: body.username,
    });
    if (user) {
      return {
        status: false,
        data: [],
        msg: "User đã tồn tại",
      };
    }
    let password = body.password;
    const salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    const userModel = new UserModel({
      ...body,
      password: hash,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const document = await userModel.save();
    return {
      status: true,
      data: {
        userData: {
          _id: document._id,
          username: document.username,
          avatar: document.avatar,
          playHistory: {
            totalGame: document.playHistory.totalGame,
            winGame: document.playHistory.winGame,
            loseGame: document.playHistory.loseGame,
            drawGame: document.playHistory.drawGame,
          },
          createdAt: document.createdAt,
          updatedAt: document.updatedAt,
        },
      },
    };
  }

  public static async login(body: { username: string; password: string }) {
    let user = await UserModel.findOne({
      username: body.username,
    });
    if (user && bcrypt.compareSync(body.password, user.password)) {
      const token = jwt.sign(
        { userId: user.id, createdDate: Date.now() },
        Locals.config().appSecret
      );

      user.token = token;
      await user.save();
      return {
        status: true,
        data: {
          userData: {
            _id: user._id,
            username: user.username,
            avatar: user.avatar,
            playHistory: {
              totalGame: user.playHistory.totalGame,
              winGame: user.playHistory.winGame,
              loseGame: user.playHistory.loseGame,
              drawGame: user.playHistory.drawGame,
            },
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          token: token,
        },
      };
    }

    return {
      status: false,
      data: [],
      msg: "Tài khoản hoặc mật khẩu không chính xác",
    };
  }

  public static async logout(id: string) {
    let user = await UserModel.findById(id);
    if (!user) {
      return {
        status: false,
        data: [],
        msg: "Có lỗi xảy ra",
      };
    }
    user.token = "0";
    await user.save();
    return {
      status: true,
      data: [],
    };
  }
}

export default UserController;
