import { Message } from "@/domain/models";

interface ListenerEvents {
  "message:new": Message;
  "message:success": string;
  "message:fail": string;
}

interface EmitterEvents {
  "message:new": [Message];
  "message:success": [string];
  "message:fail": [string];
}

export interface MessageEvents {
  on<K extends keyof ListenerEvents>(
    event: K,
    listener: (data: ListenerEvents[K]) => void
  ): void;

  off<K extends keyof ListenerEvents>(
    event: K,
    listener: (data: ListenerEvents[K]) => void
  ): void;

  emit<K extends keyof EmitterEvents>(
    event: K,
    ...data: EmitterEvents[K]
  ): void;
}
