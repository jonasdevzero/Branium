import { Contact } from "@/domain/models";
import { toast } from "sonner";

interface ListContactDTO {
  page: number;
  limit: number;

  search?: string;
}

interface ListContactResultDTO {
  pages: number;
  content: Contact[];
}

export async function listContact(
  data: ListContactDTO
): Promise<ListContactResultDTO> {
  if (data.search?.length === 0) {
    delete data.search;
  }

  const query = new URLSearchParams();

  Object.entries(data).map(([key, value]) => query.append(key, value));

  const response = await fetch(`/api/contact?${query}`);

  if (response.status === 500) {
    toast.error(
      "Parece que houve algum problema, tente novamente em instantes!",
      {
        id: "server-error",
      }
    );
  }

  const result = await response.json();

  if (!response.ok) throw await result;
  return result;
}
