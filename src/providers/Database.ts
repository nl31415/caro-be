import mongoose from "mongoose";
import { MongoError } from "mongodb";
import Locals from "../providers/Locals";

class Database {
  // Initialize your database pool
  public static async init() {
    const dbUrl = Locals.config().dbUrl;
    try {
      const url = "mongodb:localhost:27017";
      await mongoose.connect(dbUrl);
      console.log("connected to mongo server");
    } catch (e) {
      console.log("Failed to connect to the Mongo server!!");
    }
  }
}

export default Database;
