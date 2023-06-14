import { Router } from "express";
import Container from "typedi";
import config from "../../config";
import IEmbedController from "../../controllers/embed/interface-controllers/IEmbedController";
const route = Router();

export default (app: Router) => {
  app.use("/embedding", route);
  const ctrl = Container.get(config.controllers.embed.name) as IEmbedController;

  route.post("/redo", (req, res, next) => ctrl.redoEmbedding(req, res, next));
};
