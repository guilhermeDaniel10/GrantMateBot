import { Repo } from "../../core/infra/Repo";
import { File } from "../../domain/file/file";
import { FileId } from "../../domain/file/fileId";
import { FileName } from "../../domain/file/fileName";
import { SystemRole } from "../../domain/system-role/systemRole";
import { SystemRoleName } from "../../domain/system-role/systemRoleName";

export default interface IFileRepo extends Repo<File> {
  exists(file: File): Promise<boolean>;
  save(file: File): Promise<File>;
  upload(file: File): Promise<File>;
  delete(fileId: FileId | number): Promise<File>;
  findByName(filename: FileName | string): Promise<File | null>;
}
