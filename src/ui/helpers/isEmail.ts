import { z } from "zod";

export const isEmail = (email: string) =>
  z.string().email().safeParse(email).success;
