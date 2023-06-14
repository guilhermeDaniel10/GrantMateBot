import { Inject, Service } from "typedi";
import ISystemRoleController from "../interface-controllers/ISystemRoleController";
import { Request, Response, NextFunction } from "express";
import config from "../../../config";
import ISystemRoleService from "../../../services/interface_services/ISystemRoleService";
import { ISystemRoleDTO } from "../../../dto/ISystemRoleDTO";
import { Result } from "../../../core/logic/Result";

@Service()
export default class SystemRoleController implements ISystemRoleController {
  constructor(
    @Inject(config.services.systemRole.name)
    private systemRoleServiceInstance: ISystemRoleService
  ) {}
  async createSystemRole(req: Request, res: Response, next: NextFunction) {
    try {
      const systemRoleOrError = (await this.systemRoleServiceInstance.create(
        req.body as ISystemRoleDTO
      )) as Result<ISystemRoleDTO>;

      if (systemRoleOrError.isFailure) {
        return res
          .status(systemRoleOrError.getErrorCode())
          .send(systemRoleOrError.getErrorValue());
      }

      const systemRoleDTO = systemRoleOrError.getValue();
      return res.json(systemRoleDTO).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }
  async findSystemRoleByName(req: Request, res: Response, next: NextFunction) {
    try {
      const systemRoleOrError =
        (await this.systemRoleServiceInstance.findSystemRoleByname(
          req.body as ISystemRoleDTO
        )) as Result<ISystemRoleDTO>;

      if (systemRoleOrError.isFailure) {
        return res
          .status(systemRoleOrError.getErrorCode())
          .send(systemRoleOrError.getErrorValue());
      }

      const systemRoleDTO = systemRoleOrError.getValue();
      return res.json(systemRoleDTO).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }
}
