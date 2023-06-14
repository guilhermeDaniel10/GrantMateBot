import { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import config from "../../config";
import { Joi, celebrate } from "celebrate";
import ITopicController from "../../controllers/topic-controller/interface-controllers/ITopicController";
import IGPTAIWritterController from "../../controllers/gpt-ai-writter/interface-controllers/IGPTAIWritterController";
const route = Router();

export default (app: Router) => {
  app.use("/topic", route);
  const ctrl = Container.get(config.controllers.topic.name) as ITopicController;

  route.post(
    "/k-search",
    celebrate({
      body: Joi.object({
        topic: Joi.string().required(),
        k_number: Joi.number().required(),
      }),
    }),
    (req, res, next) => ctrl.findTopicByPromptTopKSearch(req, res, next)
  );

  route.get("/test", (req, res, next) => ctrl.test(req, res, next));
};
