import { Invite } from "@/domain/models";

interface ListenerEvents {
  "invite:new": Invite;
  "invite:answered": () => void;
}

interface EmitterEvents {
  "invite:new": [Invite];
  "invite:answered": [];
  message: [{ text: string }];
}

export interface InvitesContextEvent {
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

export interface InvitesContextProps {
  count: number;
  event: InvitesContextEvent;
}
