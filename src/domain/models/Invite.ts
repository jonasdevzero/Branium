export interface Invite {
  id: string;

  message: string | null;

  sender: {
    name: string;
    username: string;
    image?: string;
  };

  createdAt: Date;
}
