import { Request, Response, NextFunction } from "express";

export default interface ITopicController {
    findTopicByPromptTopKSearch(req: Request, res: Response, next: NextFunction): any;
    test(req: Request, res: Response, next: NextFunction): any;
}