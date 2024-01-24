import { User } from "@/domain/models";
import { toast } from "@/ui/modules";
import { Paginated } from "@/ui/types";

interface ListProfilesDTO {
  page?: number;
  limit?: number;

  search?: string;
}

type ListProfilesResultDTO = Paginated<User>;

export async function listProfilesService(
  data: ListProfilesDTO = {}
): Promise<ListProfilesResultDTO> {
  if (data.search?.length === 0) {
    delete data.search;
  }

  const query = new URLSearchParams();

  Object.entries(data).map(([key, value]) => query.append(key, value));

  const url = `/api/profile/list?${query.toString()}`;

  const response = await fetch(url, {});

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
