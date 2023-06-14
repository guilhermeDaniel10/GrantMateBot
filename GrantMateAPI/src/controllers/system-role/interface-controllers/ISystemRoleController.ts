import { Request, Response, NextFunction } from "express";

export default interface ISystemRoleController {
  createSystemRole(req: Request, res: Response, next: NextFunction): any;
  findSystemRoleByName(req: Request, res: Response, next: NextFunction): any;
}
