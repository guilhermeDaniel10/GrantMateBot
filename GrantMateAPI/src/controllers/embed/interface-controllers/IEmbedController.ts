import { Request, Response, NextFunction } from "express";

export default interface IEmbedController {
  redoEmbedding(req: Request, res: Response, next: NextFunction): any;
}
