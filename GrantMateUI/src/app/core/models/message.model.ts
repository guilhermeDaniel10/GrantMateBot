import { ChatDropdown } from "./chat-dropdown.model";

export interface MessageModel {
    content: string;
    isFromBot: boolean;
    selections?: string[];
    dropdown?: ChatDropdown[];
    needsInput?: boolean;
  }
  