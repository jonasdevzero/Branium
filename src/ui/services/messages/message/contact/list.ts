import {
  ListContactMessagesDTO,
  listContactMessagesResultDTO,
} from "@/domain/dtos/message/contact/ListContactMessagesDTO";
import { toast } from "sonner";

export async function listContactMessages(
  data: ListContactMessagesDTO
): Promise<listContactMessagesResultDTO> {
  const { contactId, ...params } = data;

  const query = new URLSearchParams();

  Object.entries(params).map(([key, value]) =>
    query.append(key, value.toString())
  );

  const response = await fetch(`/api/message/contact/${contactId}?${query}`);

  if (response.status === 500) {
    toast.error(
      "Parece que houve algum problema, tente novamente em instantes!",
      {
        id: "server-error",
      }
    );
  }

  const result = await response.json();

  if (!response.ok) throw result;
  return result;
}
