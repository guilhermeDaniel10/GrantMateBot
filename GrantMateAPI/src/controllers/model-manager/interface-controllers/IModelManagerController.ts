import { Request, Response, NextFunction } from "express";

export default interface IModelManagerController {
  generateTextViaPrompt(req: Request, res: Response, next: NextFunction): any;
  generateTextViaPromptGpt3(req: Request, res: Response, next: NextFunction): any;
  topicSearch(req: Request, res: Response, next: NextFunction): any;
}
