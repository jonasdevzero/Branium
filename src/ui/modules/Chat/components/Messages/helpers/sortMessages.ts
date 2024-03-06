import { Message } from "@/domain/models";
import { getTime } from "@/ui/helpers";

export function sortMessages(messages: Message[]) {
  return messages
    .reduce(removeDuplicated, [] as Message[])
    .sort((m1, m2) => (getTime(m1.createdAt) > getTime(m2.createdAt) ? 1 : -1));
}

function removeDuplicated(messages: Message[], message: Message) {
  const hasMessage = messages.some((m) => m.id === message.id);
  !hasMessage ? messages.push(message) : null;

  return messages;
}
