import { Message } from "@/domain/models";

export interface SelectedMessageDTO {
  type: "REPLY" | "EDIT" | "NAVIGATE";
  data: Message;
}
