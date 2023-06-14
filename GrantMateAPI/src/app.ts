import express, { Application } from "express";
import morgan from "morgan";
import dotenv from "dotenv";

const dotenvPath = process.env.NODE_ENV
  ? `.env.${process.env.NODE_ENV}`
  : ".env";
dotenv.config({ path: dotenvPath });

function startServer() {
  const app = express();
  app.use(morgan("dev"));
  require("./loaders").default({ expressApp: app });

  app
    .listen(process.env.PORT, () => {
      console.log("\x1b[34m", "Server listening on port: " + process.env.PORT);
    })
    .on("error", (err) => {
      console.error(err);
      process.exit(1);
      return;
    });
}

startServer();
