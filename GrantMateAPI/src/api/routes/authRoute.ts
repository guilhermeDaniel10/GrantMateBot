import { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import config from "../../config";
import IUserController from "../../controllers/user/interface-controllers/IUserController";
import { Joi, celebrate } from "celebrate";
const route = Router();

export default (app: Router) => {
  app.use("/auth", route);
  const ctrl = Container.get(config.controllers.user.name) as IUserController;

  route.post(
    "/signup",
    celebrate({
      body: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        address: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.signUp(req, res, next)
  );

  route.post(
    "/signin",
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.signIn(req, res, next)
  );
};
