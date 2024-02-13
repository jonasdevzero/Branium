import { createContactMessage, listContactMessages } from "./contact";

export const messageService = Object.freeze({
  contact: {
    list: listContactMessages,
    create: createContactMessage,
  },
});
