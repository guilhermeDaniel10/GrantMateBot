export interface IInputMessageDTO {
  predefinedMessageId?: number;
  predefiendMessageNameId: string;
  selectedDropdownValueId?: number;
  selectedDropdownValueNameId: string;
  usefulPayload?: object;
  canceled?: boolean;
}
