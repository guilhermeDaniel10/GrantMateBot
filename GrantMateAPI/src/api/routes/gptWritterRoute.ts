import { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import config from "../../config";
import { Joi, celebrate } from "celebrate";
import IGPTAIWritterController from "../../controllers/gpt-ai-writter/interface-controllers/IGPTAIWritterController";
import ISystemRoleController from "../../controllers/system-role/interface-controllers/ISystemRoleController";
import IModelManagerController from "../../controllers/model-manager/interface-controllers/IModelManagerController";
const route = Router();

export default (app: Router) => {
  app.use("/gpt", route);

  const modelController = Container.get(
    config.controllers.modelManager.name
  ) as IModelManagerController;

};
