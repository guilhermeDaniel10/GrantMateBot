import { Request, Response, NextFunction } from "express";

export default interface IChatController {
  getNextMessage(req: Request, res: Response, next: NextFunction): any;
  getInitialMessage(req: Request, res: Response, next: NextFunction): any;
}
