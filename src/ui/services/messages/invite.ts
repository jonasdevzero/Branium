import {
  CreateInviteDTO,
  ListInvitesDTO,
  ResponseInviteDTO,
} from "@/domain/dtos";
import { Invite } from "@/domain/models";
import { createQueryParams } from "@/ui/helpers";
import { Paginated } from "@/ui/types";
import { Fetch } from "@/ui/utils";

export const inviteServices = {
  list(data: ListInvitesDTO) {
    const query = createQueryParams(data);
    return Fetch.get<Paginated<Invite>>(`/api/invite?${query}`);
  },

  create(data: CreateInviteDTO) {
    return Fetch.post<void>(`/api/invite`, data);
  },

  response(data: ResponseInviteDTO) {
    return Fetch.post(`/api/invite/response`, data);
  },

  count() {
    return Fetch.get<number>("/api/invite/count");
  },
};
