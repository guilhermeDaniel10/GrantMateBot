import { Result } from "../../core/logic/Result";
import { IStructureOutputDTO } from "../../dto/IStructureOutputDTO";

export default interface IEmbedService {
  redoEmbedding(): Promise<Result<IStructureOutputDTO>>;
}
