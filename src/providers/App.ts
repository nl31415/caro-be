import path from "path";
import dotenv from "dotenv";

import Database from "./Database";
import Express from "./Express";

class App {
  // Clear the console
  public clearConsole(): void {
    process.stdout.write("\x1B[2J\x1B[0f");
  }

  // Loads your dotenv file
  public loadConfiguration(): void {
    dotenv.config({ path: path.join(__dirname, "../../.env") });
  }

  // Loads your Server
  public loadServer(): void {
    Express.init();
  }

  // Loads the Database Pool
  public loadDatabase(): void {
    Database.init();
  }
}

export default new App();
