import { inviteService } from "./invite";
import { profileServices } from "./profile";

export const messagesService = {
  profile: profileServices,
  invite: inviteService,
};
