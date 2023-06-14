import { DTO } from "./DTO";

export interface Mapper<T> {
  toDomain(raw: any): T | null;
  toDTO(t: T): DTO;
  toPersistence(t: T): any;
}
