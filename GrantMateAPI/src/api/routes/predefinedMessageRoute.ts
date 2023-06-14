import { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import config from "../../config";
import { Joi, celebrate } from "celebrate";
import ISystemRoleController from "../../controllers/system-role/interface-controllers/ISystemRoleController";
import IPredefinedMessageController from "../../controllers/message/interface-controllers/IPredefinedMessageController";
import IDropdownController from "../../controllers/message/interface-controllers/IDropdownController";
const route = Router();

export default (app: Router) => {
  app.use("/predefined-messages", route);
  const ctrl = Container.get(
    config.controllers.predefinedMessage.name
  ) as IPredefinedMessageController;

  const dropdownController = Container.get(
    config.controllers.dropdownController.name
  ) as IDropdownController;

  route.post("", (req, res, next) =>
    ctrl.readPredefinedMessages(req, res, next)
  );

  route.post("/dropdown", (req, res, next) =>
    ctrl.readDropdownMessages(req, res, next)
  );

  route.post("/service-call", (req, res, next) =>
    ctrl.readServiceCallMessages(req, res, next)
  );

  route.post("/relations", (req, res, next) =>
    ctrl.readPredefinedMessageRelations(req, res, next)
  );

  route.post("/bootstrap", (req, res, next) =>
    ctrl.bootstrapPredefinedMessages(req, res, next)
  );

  route.get(
    "/dropdown",
    celebrate({
      query: Joi.object({
        nameId: Joi.string().required(),
      }),
    }),
    (req, res, next) => dropdownController.findDropdownByNameId(req, res, next)
  );

  route.get(
    "",
    celebrate({
      query: Joi.object({
        nameId: Joi.string(),
        id: Joi.number(),
      }),
    }),
    (req, res, next) => ctrl.findPredefinedMessageById(req, res, next)
  );

  route.delete("", (req, res, next) =>
    ctrl.deleteAllPredefinedMessages(req, res, next)
  );
};
