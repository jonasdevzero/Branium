import { Invite } from "@/domain/models";
import { toast } from "@/ui/modules";
import { Paginated } from "@/ui/types";

interface ListInvitesDTO {
  page: number;
  limit: number;

  search?: string;
}

export async function listInvites(
  data: ListInvitesDTO
): Promise<Paginated<Invite>> {
  if (data.search?.length === 0) {
    delete data.search;
  }

  const query = new URLSearchParams();

  Object.entries(data).map(([key, value]) => query.append(key, value));

  const response = await fetch(`/api/invite?${query}`);

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
