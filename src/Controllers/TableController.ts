import { UserCreateBody, UserModel } from "../Models/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Locals from "../providers/Locals";
import { ITable, TableCreateBody, TableModel } from "../Models/TableModel";
import { getUserInfo } from "../helps/GetUserInfo";
import { getUserId } from "../helps/GetUserId";
import { getTableIndex } from "../helps/GetTableIndex";
import { omit } from "../helps/Omit";
class TableController {
  public static async getTable(limit: number, offset: number, status?: string) {
    let table = await TableModel.find();
    if (!table) {
      return {
        status: false,
        data: [],
        msg: "Không tìm thấy bàn",
      };
    }

    let convertTable: any = [];
    table.forEach((e) => {
      convertTable.push(omit("password", e.toObject()));
    });

    return {
      status: true,
      data: {
        data: convertTable,
      },
    };
  }

  public static async getTableById(id: string) {
    let table = await TableModel.findById(id);
    if (!table) {
      return {
        status: false,
        data: [],
        msg: "Không tìm thấy bàn",
      };
    }

    return {
      status: true,
      data: omit("password", table.toObject()),
    };
  }

  public static async createTable(token: string, body: TableCreateBody) {
    // lay user id
    let decode: any = await jwt.verify(token, Locals.config().appSecret);
    if (!decode.userId) {
      return {
        status: false,
        data: [],
        msg: "Tạo bàn không thành công",
      };
    }

    // check user co trong 1 ban khac
    let table = await TableModel.find({
      member: { $elemMatch: { _id: decode.userId } },
    });

    if (table.length !== 0) {
      return {
        status: false,
        data: [],
        msg: "User đang có trong bàn khác",
      };
    }

    // ko cho tao neu user co trong 1 ban khac
    let user = await UserModel.findById(decode.userId);
    if (!user) {
      return {
        status: false,
        data: [],
        msg: "User đang có trong bàn khác",
      };
    }

    // index table
    const tableIndex = await getTableIndex();

    // tao ban
    let hash: string | undefined = undefined;

    if (body.password) {
      const salt = bcrypt.genSaltSync(10);
      hash = bcrypt.hashSync(body.password, salt);
    }

    let tableData: ITable = {
      tableName: body.tableName,
      member: [
        {
          username: user.username,
          avatar: user.avatar,
          _id: user._id,
          score: 0,
          playerType: 0,
        },
      ],
      status: "watting",
      matchHistory: [],
      private: !hash ? false : true,
      createAt: Date.now(),
      updateAt: Date.now(),
      index: tableIndex,
    };

    if (hash) {
      tableData.password = hash;
    }

    const tableModel = new TableModel({ ...tableData });

    const document = await tableModel.save();
    return {
      status: true,
      data: omit("password", document.toObject()),
    };
  }

  public static async joinTable(token: string, tableId: string, body: any) {
    // lay user info
    let userId = await getUserId(token);
    if (!userId) {
      return {
        status: false,
        data: [],
        msg: "User không tồn tại",
      };
    }

    let userInfo = await getUserInfo(userId);
    if (!userInfo) {
      return {
        status: false,
        data: [],
        msg: "User không tồn tại",
      };
    }

    // find table
    let table = await TableModel.findById(tableId);
    if (!table) {
      return {
        status: false,
        data: [],
        msg: "Bàn không tồn tại",
      };
    }

    // check member
    if (table.member.filter((e) => e._id === userId).length !== 0) {
      return {
        status: false,
        data: [],
        msg: "Bạn đã trong bàn",
      };
    }

    if (table.member.length >= 2) {
      return {
        status: false,
        data: [],
        msg: "Bàn full người",
      };
    }

    console.log("1");
    // check password
    if (table.private && table.password) {
      if (!bcrypt.compareSync(body.tablePassword, table.password)) {
        return {
          status: false,
          data: [],
          msg: "Mật khẩu không chính xác",
        };
      }
    }

    // join ban
    table.member.push({
      username: userInfo.username,
      _id: userInfo._id,
      avatar: userInfo.avatar,
      score: 0,
      playerType: 1,
    });
    const document = await table.save();
    return {
      status: true,
      data: omit("password", document.toObject()),
    };
  }

  public static async outTable(token: string, tableId: string) {
    // lay user info
    let userId = await getUserId(token);
    if (!userId) {
      return {
        status: false,
        data: [],
        msg: "User không tồn tại",
      };
    }

    let userInfo = await getUserInfo(userId);
    if (!userInfo) {
      return {
        status: false,
        data: [],
        msg: "User không tồn tại",
      };
    }

    // find table
    let table = await TableModel.findById(tableId);
    if (!table) {
      return {
        status: false,
        data: [],
        msg: "Bàn không tồn tại",
      };
    }

    if (table.member.length === 1) {
      await TableModel.deleteOne({ _id: tableId });
      return {
        status: true,
        data: { event: "delete" },
      };
    }

    table.member = table.member.filter((e) => e._id !== userId);

    await table.save();
    return {
      status: true,
      data: { event: "change", table: table },
    };
  }
}

export default TableController;
