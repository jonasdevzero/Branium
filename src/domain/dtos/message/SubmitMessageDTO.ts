import { Message, MessageType } from "@/domain/models";

export interface SubmitMessageDTO {
  text?: string;
  type: MessageType;
  files: File[];
  reply?: Message;
}
