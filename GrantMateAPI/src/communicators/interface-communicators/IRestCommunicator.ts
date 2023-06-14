import { IRequestDTO } from "../../dto/IRequestDTO";
import { IResponseDTO } from "../../dto/IResponseDTO";

export default interface IKafkaCommunicator {
  sendRequest<T>(request: IRequestDTO): Promise<IResponseDTO<T>>;
  sendGetRequest<T>(request: IRequestDTO): Promise<IResponseDTO<T>>;
}
