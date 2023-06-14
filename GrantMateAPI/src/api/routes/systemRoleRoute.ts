import { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import config from "../../config";
import { Joi, celebrate } from "celebrate";
import ISystemRoleController from "../../controllers/system-role/interface-controllers/ISystemRoleController";
const route = Router();

export default (app: Router) => {
  app.use("/system/roles", route);
  const ctrl = Container.get(
    config.controllers.systemRole.name
  ) as ISystemRoleController;

  route.post(
    "",
    celebrate({
      body: Joi.object({
        systemRoleName: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.createSystemRole(req, res, next)
  );
};
