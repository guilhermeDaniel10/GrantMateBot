import { Container, Service } from "typedi";
import IHierarchyManagerService from "../interface_services/IHierarchyManagerService";
import { Result } from "../../core/logic/Result";
import { IHierarchyDTO } from "../../dto/IHierarchyDTO";
import { ISectionDTO } from "../../dto/ISectionDTO";
import { IStructureLineDTO } from "../../dto/IStructureLineDTO";
import { IH2SectionDTO } from "../../dto/IH2SectionDTO";
import { IH3SectionDTO } from "../../dto/IH3SectionDTO";
import * as fs from "fs";
import { StatusCodes } from "http-status-codes";

@Service()
export default class HierarchyManagerService
  implements IHierarchyManagerService
{
  constructor() {}

  async uploadHierarchy(
    hierarchySections: IHierarchyDTO[]
  ): Promise<Result<IStructureLineDTO[]>> {
    try {
      let result: IStructureLineDTO[] = [];
      hierarchySections.forEach((hierarchy) => {
        result = [...result, ...this.handleSection(hierarchy)];
      });

      result.forEach(async (line) => {
        console.log(line);
        const uploadLineResult = await this.uploadLine(line);

        if (uploadLineResult.isFailure) {
          return Result.fail<IStructureLineDTO[]>(
            uploadLineResult.error.toString()
          );
        }
      });
      console.log("here");
      console.log(result);

      return Result.ok<IStructureLineDTO[]>(result);
    } catch (e: any) {
      console.log(e);
      return Result.fail<IStructureLineDTO[]>(e.message, StatusCodes.CONFLICT);
    }
  }

  handleSection(hierarchyDTO: IHierarchyDTO): IStructureLineDTO[] {
    let result: IStructureLineDTO[] = [];
    const mainTitle = hierarchyDTO.h1Content;
    if (hierarchyDTO.paragraphsSections.length > 0) {
      const paragraph = this.handleArrayToString(
        hierarchyDTO.paragraphsSections
      );
      result.push({ iteration: 0, heading: mainTitle, paragraph: paragraph });
    }
    console.log("MAIN TITLE: ", mainTitle);

    hierarchyDTO.h2Sections.forEach((h2) => {
      console.log("LETS GO");
      console.log(h2);

      const h2Section = this.headingHandler(
        mainTitle,
        h2.h2Content,
        h2.paragraphsSections
      );
      if (h2Section.paragraph && h2.paragraphsSections.length > 0)
        result.push(h2Section);

      const currentH2Title = h2Section.heading;
      h2.h3Sections.forEach((h3) => {
        const h3Section = this.headingHandler(
          currentH2Title,
          h3.h3Content,
          h3.paragraphsSections
        );

        if (h3Section.paragraph && h3.paragraphsSections.length > 0)
          result.push(h3Section);
      });
    });

    return result;
  }

  private headingHandler(
    parentTitle: string,
    currentTitle: string,
    paragraphContent: string[]
  ): IStructureLineDTO {
    console.log(parentTitle);
    console.log(currentTitle);
    console.log(paragraphContent);
    const composedTitle = this.handleArrayToString([parentTitle, currentTitle]);
    const composedParagraph = this.handleArrayToString(paragraphContent);

    return {
      iteration: 0,
      heading: composedTitle,
      paragraph: composedParagraph,
    };
  }

  private handleArrayToString(array: string[]) {
    return array.join(" ");
  }

  private async uploadLine(
    line: IStructureLineDTO
  ): Promise<Result<IStructureLineDTO>> {
    try {
      const iteration = line.iteration;
      const heading = line.heading;
      const paragraph = line.paragraph;

      const lineToAdd =
        iteration + "|" + heading + "|" + paragraph + "|" + "english\n";

      const filePath = "/usr/app/file-storage/structured_data.csv";

      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(
          filePath,
          "iteration|heading|paragraph|language\n",
          "utf8"
        );
      }

      fs.appendFileSync(filePath, lineToAdd, "utf8");

      console.log("New line added to the file.");

      return Result.ok<IStructureLineDTO>(line);
    } catch (e: any) {
      return Result.fail<IStructureLineDTO>(e.message, StatusCodes.CONFLICT);
    }
  }
}
