export interface Contact {
  id: string;
  username: string;
  image?: string;
  blocked: boolean;
  youBlocked: boolean;

  messages: [];
}

export interface Group {
  id: string;
  name: string;
  image?: string;
  description?: string;

  users: [];
  messages: [];
}

type InviteType = 'CONTACT' | 'GROUP';

export interface Invite {
  id: string;
  type: InviteType;
  pending: boolean;
  expiresAt?: Date;

  sender: {
    id: string;
    username: string;
    image?: string;
  };
}

export interface User {
  id: string;
  username: string;
  image?: string;
  email?: string;
  verified: boolean;

  invites: Invite[];
  contacts: Contact[];
  groups: Group[];
}
