import { Router } from "express";
import Container from "typedi";
import config from "../../config";
import IChatController from "../../controllers/message/interface-controllers/IChatController";
import { Joi, celebrate } from "celebrate";

const route = Router();

export default (app: Router) => {
  app.use("/chat", route);
  const ctrl = Container.get(config.controllers.chat.name) as IChatController;

  route.post(
    "/next-message",
    celebrate({
      body: Joi.object({
        predefinedMessageId: Joi.number().optional(),
        predefiendMessageNameId: Joi.string().required(),
        selectedDropdownValueId: Joi.number().optional(),
        selectedDropdownValueNameId: Joi.string().optional(),
        usefulPayload: Joi.object().optional(),
        canceled: Joi.boolean().optional(),
      }),
    }),
    (req, res, next) => ctrl.getNextMessage(req, res, next)
  );

  route.get("/initial-message", (req, res, next) =>
    ctrl.getInitialMessage(req, res, next)
  );
};
