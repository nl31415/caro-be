import SocketIO from "socket.io";
declare module NodeJS {
  interface Global {
    io: SocketIO.Server;
  }
}
