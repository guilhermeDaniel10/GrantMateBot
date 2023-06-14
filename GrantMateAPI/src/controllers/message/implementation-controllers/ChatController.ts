import { Inject, Service } from "typedi";
import IChatController from "../interface-controllers/IChatController";
import { Request, Response, NextFunction } from "express";
import config from "../../../config";
import IMessageFlowService from "../../../services/interface_services/message_services/IMessageFlowService";
import { IInputMessageDTO } from "../../../dto/messages/IInputMessageDTO";

@Service()
export default class ChatController implements IChatController {
  constructor(
    @Inject(config.services.messageFlow.name)
    private messageFlowService: IMessageFlowService
  ) {}

  async getNextMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const inputMessage: IInputMessageDTO = req.body;
      const outputMessageDTO = await this.messageFlowService.getNextMessage(
        inputMessage
      );

      if (outputMessageDTO.isFailure)
        return res.status(400).json(outputMessageDTO.error);

      return res.json(outputMessageDTO.getValue()).status(201);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  async getInitialMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const initialMessageDTO =
        await this.messageFlowService.getInitialMessage();
      if (initialMessageDTO.isFailure)
        return res.status(400).json(initialMessageDTO.error);

      return res.json(initialMessageDTO.getValue()).status(201);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
}
