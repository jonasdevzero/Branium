import { CreateContactMessageDTO, ListContactMessagesDTO } from "@/domain/dtos";
import { Message } from "@/domain/models";
import { createNestedFormData, createQueryParams } from "@/ui/helpers";
import { Paginated } from "@/ui/types";
import { Fetch } from "@/ui/utils";

export const messageServices = {
  contact: {
    list(data: ListContactMessagesDTO) {
      const { contactId, ...params } = data;

      const query = createQueryParams(params);

      return Fetch.get<Paginated<Message>>(
        `/api/message/contact/${contactId}?${query}`
      );
    },

    create(data: CreateContactMessageDTO) {
      const formData = createNestedFormData(data);

      return Fetch.post("/api/message/contact", formData);
    },
  },
};
