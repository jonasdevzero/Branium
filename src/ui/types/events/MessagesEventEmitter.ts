import { NewMessageDTO } from "@/domain/dtos";

interface ListenerEvents {
  "message:new": NewMessageDTO;
  "message:success": string;
  "message:fail": string;
}

interface EmitterEvents {
  "message:new": [NewMessageDTO];
  "message:success": [string];
  "message:fail": [string];
}

export interface MessagesEventEmitter {
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
