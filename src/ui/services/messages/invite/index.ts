import { countInvite } from "./countInvite";
import { createInvite } from "./createInvite";
import { listInvites } from "./listInvite";
import { responseInvite } from "./response";

export const inviteService = {
  list: listInvites,
  create: createInvite,
  response: responseInvite,
  count: countInvite,
};
