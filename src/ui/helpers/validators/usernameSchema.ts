import { z } from "zod";

export const usernameSchema = z
  .string({ required_error: "Campo obrigatório" })
  .min(4, "Mínimo 4 caracteres")
  .max(12, "Máximo 12 caracteres")
  .refine((value) => /^[a-z-0-9-_]+$/.test(value) && !value.includes("-"), {
    message: "Apenas letras, números e _",
  });
