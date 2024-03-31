import { CreateContactMessageDTO, ListContactMessagesDTO } from "@/domain/dtos";
import { Message } from "@/domain/models";
import { createNestedFormData, createQueryParams } from "@/ui/helpers";
import { toast } from "@/ui/modules";
import { Paginated } from "@/ui/types";
import { Fetch, Tempo } from "@/ui/utils";

export const messageServices = {
  async delete(messageId: string) {
    try {
      await Fetch.delete(`/api/message/${messageId}`);
      toast.success("Mensagem removida!", { id: "message-deleted" });
    } catch (error) {
      toast.success("Falha ao deletar mensagem!", { id: "message-deleted" });
    }
  },

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

      return Fetch.post<string>("/api/message/contact", formData);
    },
  },
};
