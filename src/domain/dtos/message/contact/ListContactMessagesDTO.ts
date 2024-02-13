import { Message } from "@/domain/models";
import { Paginated } from "@/ui/types";

export interface ListContactMessagesDTO {
  contactId: string;

  page?: number;
  limit?: number;
}

export type listContactMessagesResultDTO = Paginated<Message>;
