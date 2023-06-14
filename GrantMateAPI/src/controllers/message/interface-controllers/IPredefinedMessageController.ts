import { Request, Response, NextFunction } from "express";

export default interface IPredefinedMessageController {
  readPredefinedMessages(req: Request, res: Response, next: NextFunction): any;
  readDropdownMessages(req: Request, res: Response, next: NextFunction): any;
  readServiceCallMessages(req: Request, res: Response, next: NextFunction): any;
  readPredefinedMessageRelations(
    req: Request,
    res: Response,
    next: NextFunction
  ): any;
  bootstrapPredefinedMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ): any;
  findPredefinedMessageById(
    req: Request,
    res: Response,
    next: NextFunction
  ): any;
  deleteAllPredefinedMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ): any;
}
