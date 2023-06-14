import { Request, Response, NextFunction } from "express";

export default interface IFileManagerController {
  writeSimpleFileToStorage(
    req: Request,
    res: Response,
    next: NextFunction
  ): any;
  uploadHierarchy(req: Request, res: Response, next: NextFunction): any;
  uploadFile(req: Request, res: Response, next: NextFunction): any;
  uploadFileForStructuring(req: Request, res: Response, next: NextFunction): any;
  downloadFile(req: Request, res: Response, next: NextFunction): any;
  uploadStructuredFile(req: Request, res: Response, next: NextFunction): any;
  uploadSingleLineToStructure(req: Request, res: Response, next: NextFunction): any;
  uploadSingleSectionToStructure(req: Request, res: Response, next: NextFunction): any;
  uploadMultipleSectionsToStructure(req: Request, res: Response, next: NextFunction): any;
  replaceStructuredFile(req: Request, res: Response, next: NextFunction): any;
  singleFileExtraction(req: Request, res: Response, next: NextFunction): any;
  getStructuredFiles(req: Request, res: Response, next: NextFunction): any;
}
