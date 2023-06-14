import { IH3SectionDTO } from "./IH3SectionDTO";

export interface IH2SectionDTO {
  h2Content: string;
  h3Sections: IH3SectionDTO[];
  paragraphsSections: string[];
}
