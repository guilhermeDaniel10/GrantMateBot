import { Request, Response, NextFunction } from "express";

export default interface IUserController {
  signUp(req: Request, res: Response, next: NextFunction): any;
  signIn(req: Request, res: Response, next: NextFunction): any;
}
