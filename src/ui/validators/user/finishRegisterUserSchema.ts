import { z } from "@lib/zod";

export const finishRegisterUserSchema = z.object({
  token: z.string(),
  email: z.string().email(),

  name: z
    .string({ required_error: "Campo obrigatório" })
    .min(3, { message: "Mínimo de 3 caracteres" })
    .max(32, { message: "Máximo de 32 caracteres" }),
});
