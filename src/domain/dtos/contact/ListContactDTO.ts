import { Contact } from "@/domain/models";
import { Paginated } from "@/ui/types";

export interface ListContactDTO {
  page: number;
  limit: number;

  search?: string;
}

export type ListContactResultDTO = Paginated<Contact>;
