import { Service } from "typedi";
import { File } from "../../domain/file/file";
import { FileId } from "../../domain/file/fileId";
import { FileName } from "../../domain/file/fileName";
import { FileMapper } from "../../mappers/FileMapper";
import { FileSchema } from "../../sequelize_schemas/FileSchema";
import IFileRepo from "../interface_repositories/IFileRepo";

@Service()
export default class FileRepo implements IFileRepo {
  async exists(fileName: any): Promise<boolean> {
    const wantedFileName =
      fileName instanceof FileName ? (<FileName>fileName).value : fileName;
    const wantedFile = await FileSchema.findOne({
      where: { fileName: wantedFileName },
    });

    return !!wantedFileName === true;
  }
  async save(file: File): Promise<File> {
    const foundFile = await FileSchema.findOne({
      where: { filename: file.filename.value },
    });
    try {
      if (!foundFile) {
        const rawFile: any = FileMapper.toPersistence(file);

        const fileCreated = await FileSchema.create(rawFile);
        await fileCreated.save();

        return FileMapper.toDomain(fileCreated);
      } else {
        foundFile.filename = file.filename.value;
        foundFile.description = file.description.value;
        foundFile.size = file.size.value;
        foundFile.extension = file.extension.value;
        foundFile.accessLevel = file.accessLevels.value;
        foundFile.gptTrained = file.gptTrained.value;

        await foundFile.save();
        return file;
      }
    } catch (err) {
      throw err;
    }
  }
  upload(file: File): Promise<File> {
    throw new Error("Method not implemented.");
  }
  delete(fileId: number | FileId): Promise<File> {
    throw new Error("Method not implemented.");
  }
  async findByName(filename: string | FileName): Promise<File | null> {
    const wantedFileName =
      filename instanceof FileName ? (<FileName>filename).value : filename;
    const wantedFile = await FileSchema.findOne({
      where: { fileName: wantedFileName },
    });

    if (wantedFile != null) {
      return FileMapper.toDomain(wantedFile);
    }
    return null;
  }
}
