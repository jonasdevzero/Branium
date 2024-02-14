import { contactServices } from "./contact";
import { inviteServices } from "./invite";
import { messageService } from "./message";
import { profileServices } from "./profile";

export const messagesService = {
  profile: profileServices,
  invite: inviteServices,
  contact: contactServices,
  message: messageService,
};
