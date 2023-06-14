export interface IDropdownCorrespondingValuesDTO {
  nameId: string;
  asButton?: boolean;
  values: {
    nameId: string;
    asButton?: boolean;
    content: string;
  }[];
}
