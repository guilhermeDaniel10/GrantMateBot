import { Result } from "../../core/logic/Result";
import { IHierarchyDTO } from "../../dto/IHierarchyDTO";
import { IStructureLineDTO } from "../../dto/IStructureLineDTO";

export default interface IHierarchyManagerService {
  uploadHierarchy(
    hierarchySections: IHierarchyDTO[]
  ): Promise<Result<IStructureLineDTO[]>>;
}
