import { passwordSchema, usernameSchema } from "@/ui/helpers";
import { z } from "@lib/zod";

export const registerUserSchema = z.object({
  username: usernameSchema,
  email: z
    .string({ required_error: "Campo obrigatório" })
    .email("Email inválido"),
  password: passwordSchema,
});
