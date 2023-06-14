import { Request, Response, NextFunction } from "express";
import IEmbedController from "../interface-controllers/IEmbedController";
import { Inject, Service } from "typedi";
import config from "../../../config";
import IEmbedService from "../../../services/interface_services/IEmbedService";

@Service()
export default class EmbedController implements IEmbedController {
  constructor(
    @Inject(config.services.embed.name)
    private embedServiceInstance: IEmbedService
  ) {}
  async redoEmbedding(req: Request, res: Response, next: NextFunction) {
    try {
      const redoEmbedOrError = await this.embedServiceInstance.redoEmbedding();

      if (redoEmbedOrError.isFailure) {
        return res
          .status(redoEmbedOrError.getErrorCode())
          .send(redoEmbedOrError.getErrorValue());
      }

      const redoEmbedDTO = redoEmbedOrError.getValue();
      return res.json(redoEmbedDTO).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }
}
