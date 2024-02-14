import { contactServices } from "./contact";
import { inviteServices } from "./invite";
import { messageServices } from "./message";
import { profileServices } from "./profile";

export const messagesService = Object.freeze({
  profile: profileServices,
  invite: inviteServices,
  contact: contactServices,
  message: messageServices,
});
