import { Inject, Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import config from "../../../config";
import IPredefinedMessageController from "../interface-controllers/IPredefinedMessageController";
import IPredefinedMessageReadService from "../../../services/interface_services/message_services/IPredefinedMessageReadService";
import { Result } from "../../../core/logic/Result";
import { IPredefinedMessageDTO } from "../../../dto/messages/IPredefinedMessageDTO";
import IDropdownService from "../../../services/interface_services/message_services/IDropdownReadService";
import { IDropdownCorrespondingValuesDTO } from "../../../dto/messages/IDropdownCorrespondingValuesDTO";
import IServiceCallService from "../../../services/interface_services/message_services/IServiceCallService";
import { IServiceCallDTO } from "../../../dto/messages/IServiceCallDTO";
import IPredefinedMessageRelationReadService from "../../../services/interface_services/message_services/IPredefinedMessageRelationReadService";
import { IPredefinedMessageRelationDTO } from "../../../dto/messages/IPredefinedMessageRelationDTO";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import IPredefinedMessageBootstrapService from "../../../services/interface_services/message_services/IPredefinedMessagesBootstrapService";
import { IMessagesBootstrapDTO } from "../../../dto/messages/IMessagesBootstrapDTO";

@Service()
export default class PredefinedMessageController
  implements IPredefinedMessageController
{
  constructor(
    @Inject(config.services.predefinedMessageReader.name)
    private predefinedMessageReadService: IPredefinedMessageReadService,
    @Inject(config.services.dropdownReader.name)
    private dropdownReaderService: IDropdownService,
    @Inject(config.services.serviceCallReader.name)
    private serviceCallReaderService: IServiceCallService,
    @Inject(config.services.predefinedMessageRelationReader.name)
    private predefinedMessageRelationReadService: IPredefinedMessageRelationReadService,
    @Inject(config.services.predefinedMessagesBootstrap.name)
    private predefinedMessageBootstrapService: IPredefinedMessageBootstrapService
  ) {}
  async readPredefinedMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const predefinedMessageOrError =
        (await this.predefinedMessageReadService.readPredefinedMessages()) as Result<
          IPredefinedMessageDTO[]
        >;

      if (predefinedMessageOrError.isFailure) {
        return res
          .status(predefinedMessageOrError.getErrorCode())
          .send(predefinedMessageOrError.getErrorValue());
      }

      const predefinedMessageArrayDTO = predefinedMessageOrError.getValue();
      return res.json(predefinedMessageArrayDTO).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  async readDropdownMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const dropdownnOrError =
        (await this.dropdownReaderService.readDropdownMessages()) as Result<
          IDropdownCorrespondingValuesDTO[]
        >;

      if (dropdownnOrError.isFailure) {
        return res
          .status(dropdownnOrError.getErrorCode())
          .send(dropdownnOrError.getErrorValue());
      }

      const dropdownArrayDTO = dropdownnOrError.getValue();
      return res.json(dropdownArrayDTO).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  async readServiceCallMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const serviceCallOrError =
        (await this.serviceCallReaderService.readServiceCallMessages()) as Result<
          IServiceCallDTO[]
        >;

      if (serviceCallOrError.isFailure) {
        return res
          .status(serviceCallOrError.getErrorCode())
          .send(serviceCallOrError.getErrorValue());
      }

      const serviceCallArrayDTO = serviceCallOrError.getValue();
      return res.json(serviceCallArrayDTO).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  async readPredefinedMessageRelations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const predefinedMessageRelationOrError =
        (await this.predefinedMessageRelationReadService.readPredefinedMessagesRelations()) as Result<
          IPredefinedMessageRelationDTO[]
        >;

      if (predefinedMessageRelationOrError.isFailure) {
        return res
          .status(predefinedMessageRelationOrError.getErrorCode())
          .send(predefinedMessageRelationOrError.getErrorValue());
      }

      const predefinedMessageRelationArrayDTO =
        predefinedMessageRelationOrError.getValue();
      return res.json(predefinedMessageRelationOrError).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  async bootstrapPredefinedMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const bootstrapedMessageOrError =
        (await this.predefinedMessageBootstrapService.bootstrapPredefinedMessages()) as Result<IMessagesBootstrapDTO>;

      if (bootstrapedMessageOrError.isFailure) {
        return res
          .status(bootstrapedMessageOrError.getErrorCode())
          .send(bootstrapedMessageOrError.getErrorValue());
      }

      const bootstrapedMessagesDTO = bootstrapedMessageOrError.getValue();
      return res.json(bootstrapedMessagesDTO).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  async findPredefinedMessageById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.query.id as string;
      const nameId = req.query.nameId as string;

      if (!id && !nameId) {
        return res.status(400).send("id or nameId is required");
      }

      const predefinedMessageOrError = id
        ? await this.predefinedMessageReadService.findPredefinedMessageById(
            Number(id)
          )
        : await this.predefinedMessageReadService.findPredefinedMessageByNameId(
            nameId
          );

      if (predefinedMessageOrError.isFailure) {
        return res
          .status(predefinedMessageOrError.getErrorCode())
          .send(predefinedMessageOrError.getErrorValue());
      }

      const predefinedMessageDTO = predefinedMessageOrError.getValue();
      return res.json(predefinedMessageDTO).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  async deleteAllPredefinedMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const deletedOrError =
        await this.predefinedMessageBootstrapService.deleteAllPredefinedMessages();

      if (deletedOrError.isFailure) {
        return res
          .status(deletedOrError.getErrorCode())
          .send(deletedOrError.getErrorValue());
      }

      const deleted = deletedOrError.getValue();
      return res.json(deleted).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }
}
