import { contactServices } from "./contact";
import { inviteService } from "./invite";
import { messageService } from "./message";
import { profileServices } from "./profile";

export const messagesService = {
  profile: profileServices,
  invite: inviteService,
  contact: contactServices,
  message: messageService,
};
