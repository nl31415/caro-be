import { Server } from "socket.io";
import TableController from "../Controllers/TableController";
import { checkLogicGame, checkWin } from "../helps/LogicGame";

import { UserModel } from "../Models/UserModel";

export const onConnect = (io: Server) => {
  io.on("connection", async (socket) => {
    console.log("user connected socket");
    // variable
    let token = "";
    let tableId = "";
    let userInfo: any = undefined;
    let firstChecked = 0;

    // authen
    socket.on("auth", async (data: { token: string }) => {
      token = data.token;
      let user = await UserModel.findOne({ token: data.token });
      if (user !== null) {
        userInfo = user;
      }
    });

    //------------------------------//

    // subcrice list table
    let subcriceListTable = false;

    socket.on("subcrice-table-list", () => {
      subcriceListTable = true;
    });

    // join room
    socket.on("join", async (data: { id: string }) => {
      tableId = data.id;
      socket.join(data.id);
      socket.to(data.id).emit("user-joined", { data: userInfo });
      io.to(data.id).emit("user-check-type", { uIndex: firstChecked });
      // ban ve ban thay doi
      io.emit("table-change", {
        type: "user-joined",
        data: {
          tableId: tableId,
          newUser: userInfo,
        },
      });
    });

    let checklist: number[] = [];
    // start game
    socket.on("ready", (e) => {
      checklist = [];
      socket.to(tableId).emit("start-game", { uid: e.uid });
    });

    // on check
    socket.on("check", async (data: { position: number }) => {
      checklist.push(data.position);
      let isWin = checkWin(checklist);
      if (isWin) console.log(isWin);
      socket.to(tableId).emit("opponent-check", {
        user: userInfo._id,
        position: data.position,
      });

      if (isWin) {
        io.to(tableId).emit("win-game", {
          position: isWin,
          uid: userInfo._id,
        });
      }
    });

    // disconnect
    socket.on("disconnect", async (e) => {
      if (token && tableId) {
        socket.leave(tableId);
        let changed: any = await TableController.outTable(token, tableId);
        if (changed.status) {
          if (changed.data.event === "delete") {
            io.emit("delete-table", { tableId: tableId });
          }
          if (changed.data.event === "change") {
            io.emit("changed-table", { tableId: tableId });
          }
        }
      }
    });
  });
};
