import { Router } from "express";
import middlewares from "./middlewares";
import user from "./routes/userRoute";
import systemRole from "./routes/systemRoleRoute";
import auth from "./routes/authRoute";
import gptWritter from "./routes/gptWritterRoute";
import fileManager from "./routes/fileManagerRoute";
import topicRoute from "./routes/topicRoute";
import embedRoute from "./routes/embedRoute";
import predefinedMessageRoute from "./routes/predefinedMessageRoute";
import chatRoute from "./routes/chatRoute";

export default () => {
  const app = Router();
  auth(app);
  systemRole(app);
  user(app);
  gptWritter(app);
  fileManager(app);
  topicRoute(app);
  embedRoute(app);
  predefinedMessageRoute(app);
  chatRoute(app);

  return app;
};
