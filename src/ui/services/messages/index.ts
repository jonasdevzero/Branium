import { Fetch } from "@/ui/utils";
import { contactServices } from "./contact";
import { inviteServices } from "./invite";
import { messageServices } from "./message";
import { profileServices } from "./profile";
import { cache } from "react";

export const messagesService = Object.freeze({
  profile: profileServices,
  invite: inviteServices,
  contact: contactServices,
  message: messageServices,

  file: {
    loadUrl: cache((key: string) =>
      Fetch.get<{ url: string }>(`/api/file/${key}`)
    ),
  },
});
