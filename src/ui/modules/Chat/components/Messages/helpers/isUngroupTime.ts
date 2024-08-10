import { Message } from "@/domain/models";
import { getTime } from "@/ui/helpers";

const limit = 1000 * 60 * 3; // 3 minutes

export function isUngroupTime(message: Message, previousMessage: Message) {
  const difference =
    getTime(message.createdAt) - getTime(previousMessage.createdAt);

  return difference >= limit;
}
