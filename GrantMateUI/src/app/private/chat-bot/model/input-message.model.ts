import { UsefulPayloadConfigs } from "./useful-payload-configs.model";

export interface InputMessageModel {
  predefinedMessageId: number;
  predefiendMessageNameId: string;
  selectedDropdownValueId?: number;
  selectedDropdownValueNameId?: string;
  usefulPayload?: UsefulPayloadConfigs;
  canceled?: boolean;
}
