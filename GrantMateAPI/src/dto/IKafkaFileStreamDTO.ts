import { IFileDTO } from "./IFileDTO";
import { ITitleFormatDTO } from "./ITitleFormatDTO";

export interface IKafkaFileStreamDTO {
  streamType: string;
  filename: string;
  extension: string;
  titleFormat?: ITitleFormatDTO;
}
