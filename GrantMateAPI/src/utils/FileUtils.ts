import fs, { ReadStream } from "fs";
import path from "path";
import { IFileObjectDTO } from "../dto/IFileObjectDTO";
import { IOutputFileDTO } from "../dto/IOutputFileDTO";
import dotenv from "dotenv";

const dotenvPath = process.env.NODE_ENV;

export class FileUtils {
  //This function is not being used. The multer middleware is the primary option. But it works.
  static async saveFile(file: IFileObjectDTO): Promise<IOutputFileDTO> {
    const { fileDTO, fileContent } = file;
    const ext = path.extname(fileDTO.filename);
    const fileName = `${Date.now()}${ext}`;
    const filePath = path.join("/usr/app/file-storage/", fileName);

    await fs.promises.writeFile(filePath, fileContent.buffer);

    const fileStats = await fs.statSync(filePath);
    const fileSizeInBytes = fileStats.size;
    return { filename: fileName, size: fileSizeInBytes };
  }

  static async deleteFile(fileName: string): Promise<void> {
    const filePath = "/usr/app/file-storage/" + fileName;
    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      console.error(err);
      throw new Error(`Failed to delete file ${filePath}`);
    }
  }

  static async getFile(filename: string): Promise<ReadStream | null> {
    const filePath = "/usr/app/file-storage/" + filename;

    if (!fs.existsSync(filePath)) {
      return Promise.resolve(null);
    }

    return Promise.resolve(fs.createReadStream(filePath));
  }

  static readFileFromPredefinedMessages(file: string): any {
    const filePath =
      dotenvPath == "locally"
        ? `src/predefined_messages/${file}`
        : `/usr/app/src/predefined_messages/${file}`;
    const fileRead: any = fs.readFileSync(filePath);

    return JSON.parse(fileRead);
  }
}
