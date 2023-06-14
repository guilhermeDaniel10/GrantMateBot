import { Request, Response, NextFunction } from "express";

export default interface IDropdownController {
  readDropdowns(req: Request, res: Response, next: NextFunction): any;
  findDropdownByNameId(req: Request, res: Response, next: NextFunction): any;
}
