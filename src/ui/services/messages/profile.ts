import { EditProfileDTO, ListProfilesDTO } from "@/domain/dtos";
import { User } from "@/domain/models";
import { createNestedFormData, createQueryParams } from "@/ui/helpers";
import { Paginated } from "@/ui/types";
import { Fetch } from "@/ui/utils";

export const profileServices = {
  list(data: ListProfilesDTO) {
    const query = createQueryParams(data);

    return Fetch.get<Paginated<User>>(`/api/profile/list?${query}`);
  },

  edit(data: EditProfileDTO) {
    const formData = createNestedFormData(data);

    return Fetch.put("/api/profile", formData);
  },
};
