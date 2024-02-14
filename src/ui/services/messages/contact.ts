import { ListContactDTO, ListContactResultDTO } from "@/domain/dtos";
import { Contact } from "@/domain/models";
import { createQueryParams } from "@/ui/helpers";
import { Fetch } from "@/ui/utils";

export const contactServices = {
  list(data: ListContactDTO) {
    const query = createQueryParams(data);
    return Fetch.get<ListContactResultDTO>(`/api/contact?${query}`);
  },

  load(id: string) {
    return Fetch.get<Contact>(`/api/contact/${id}`);
  },
};
