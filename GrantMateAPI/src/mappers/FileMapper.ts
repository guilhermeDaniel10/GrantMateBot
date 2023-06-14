import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { DTO } from "../core/infra/DTO";
import { Result } from "../core/logic/Result";
import { File } from "../domain/file/file";
import { FileAccessLevels } from "../domain/file/fileAccessLevel";
import { FileDescription } from "../domain/file/fileDescription";
import { FileExtension } from "../domain/file/fileExtension";
import { FileGPTTrained } from "../domain/file/fileGPTTrained";
import { FileName } from "../domain/file/fileName";
import { FileSize } from "../domain/file/fileSize";
import { SystemRole } from "../domain/system-role/systemRole";
import { SystemRoleName } from "../domain/system-role/systemRoleName";
import { IFileDTO } from "../dto/IFileDTO";
import { ISystemRoleDTO } from "../dto/ISystemRoleDTO";

export class FileMapper {
  public static async toDomain(raw: any): Promise<File> {
    const filenameOrError = FileName.create(raw.filename);
    const descriptionOrError = FileDescription.create(raw.description);
    const sizeOrError = FileSize.create(raw.size);
    const extensionOrError = FileExtension.create(raw.filename);
    const accessLevelOrError = FileAccessLevels.create(raw.accessLevel);
    const gptTrainedOrError = FileGPTTrained.create(raw.gptTrained);

    const dtoResult = Result.combine([
      filenameOrError,
      descriptionOrError,
      sizeOrError,
      extensionOrError,
      accessLevelOrError,
      gptTrainedOrError,
    ]);

    dtoResult.isFailure ? console.log(dtoResult.error) : "";

    const fileOrError = File.create(
      {
        filename: filenameOrError.getValue(),
        description: descriptionOrError.getValue(),
        size: sizeOrError.getValue(),
        extension: extensionOrError.getValue(),
        accessLevel: accessLevelOrError.getValue(),
        gptTrained: gptTrainedOrError.getValue(),
      },
      new UniqueEntityID(raw.domainId)
    );

    if (fileOrError.isFailure) {
      throw new Error(fileOrError.error.toString());
    }

    return fileOrError.getValue();
  }
  public static toDTO(file: File): DTO {
    return {
      filename: file.filename.value,
      description: file.description.value,
      accessLevel: file.accessLevels.value,
      gptTrained: file.gptTrained.value,
    } as IFileDTO;
  }
  public static toPersistence(file: File): any {
    const filePersistence = {
      domainId: file.id.toString(),
      filename: file.filename.value,
      description: file.description.value,
      size: file.size.value,
      extension: file.extension.value,
      accessLevel: file.accessLevels.value,
      gptTrained: file.gptTrained.value,
    };
    return filePersistence;
  }
}
