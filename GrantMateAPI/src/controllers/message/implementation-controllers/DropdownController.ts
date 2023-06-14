import { Inject, Service } from "typedi";
import IDropdownController from "../interface-controllers/IDropdownController";
import { Request, Response, NextFunction } from "express";
import config from "../../../config";
import IDropdownService from "../../../services/interface_services/message_services/IDropdownReadService";

@Service()
export default class DropdownController implements IDropdownController {
  constructor(
    @Inject(config.services.dropdownReader.name)
    private dropdownService: IDropdownService
  ) {}
  readDropdowns(req: Request, res: Response, next: NextFunction) {
    throw new Error("Method not implemented.");
  }
  async findDropdownByNameId(req: Request, res: Response, next: NextFunction) {
    try {
      const dropdownNameId = req.query.nameId as string;
      const dropdownWithValues =
        await this.dropdownService.findDropdownWithValuesByNameId(
          dropdownNameId
        );

      if (dropdownWithValues.isFailure) {
        return res
          .status(dropdownWithValues.getErrorCode())
          .send(dropdownWithValues.getErrorValue());
      }

      const dropdownWithValuesDTO = dropdownWithValues;
      return res.json(dropdownWithValuesDTO.getValue()).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }
}
