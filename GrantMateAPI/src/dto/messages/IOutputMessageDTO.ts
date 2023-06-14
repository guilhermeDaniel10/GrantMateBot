import { IPredefinedMessageDTO } from "./IPredefinedMessageDTO";

export interface IOutputMessageDTO {
  mainMessage: IPredefinedMessageDTO;
  serviceResponse?: object[];
}
