import { CreateContactMessageDTO, ListContactMessagesDTO } from "@/domain/dtos";
import { Message } from "@/domain/models";
import { createNestedFormData, createQueryParams } from "@/ui/helpers";
import { Paginated } from "@/ui/types";
import { Fetch, Tempo } from "@/ui/utils";

export const messageServices = {
  contact: {
    async list(data: ListContactMessagesDTO) {
      const { contactId, ...params } = data;

      const query = createQueryParams(params);

      const result = await Fetch.get<Paginated<Message>>(
        `/api/message/contact/${contactId}?${query}`
      );

      result.content.forEach((message) => {
        const createdAt = new Tempo(message.createdAt);
        const updatedAt = message.updatedAt
          ? new Tempo(message.updatedAt)
          : null;

        Object.assign(message, { createdAt, updatedAt });
      });

      return result;
    },

    create(data: CreateContactMessageDTO) {
      const formData = createNestedFormData(data);

      return Fetch.post("/api/message/contact", formData);
    },
  },
};
