export interface Contact {
  id: string;

  name: string;
  customName: string | null;
  username: string;
  image?: string | null;

  blocked: boolean;
  youBlocked: boolean;

  createdAt: Date;
  lastUpdate: Date;
}
