import {
  EditedMessageDTO,
  NewMessageDTO,
  SuccessMessageDTO,
} from "@/domain/dtos";

interface ListenerEvents {
  "message:new": NewMessageDTO;
  "message:success": SuccessMessageDTO;
  "message:fail": string;
  "message:delete": string;
  "message:edit": EditedMessageDTO;
}

interface EmitterEvents {
  "message:new": [NewMessageDTO];
  "message:success": [SuccessMessageDTO];
  "message:fail": [string];
  "message:edit": [EditedMessageDTO];
  "message:delete": [string];
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
