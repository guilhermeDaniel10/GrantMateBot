import { Container } from "typedi";

import winston from "winston";

import config from "../../../config";
import IUserRepo from "../../../repositories/interface_repositories/IUserRepo";

/**
 * Attach user to req.user
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const attachCurrentUser = async (req: any, res: any, next: any) => {
  try {
    const userRepo = Container.get(config.repos.user.name) as IUserRepo;

    if (!req.token || req.token == undefined)
      next(new Error("Token doesn't exist or is invalid"));

    const id = req.token.id;

    const isFound = await userRepo.exists(id);

    if (isFound) next();
    else next(new Error("Token doesn't exist"));
  } catch (e) {
    console.error("Error attaching user to req: %o", e);
    return next(e);
  }
};

export default attachCurrentUser;
