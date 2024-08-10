export interface Authentication {
  access: string;
  refresh: string;
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";
