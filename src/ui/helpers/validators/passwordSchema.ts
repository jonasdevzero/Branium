import { z } from "zod";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  invalidPasswordMessage,
  isValidPassword,
} from "../password";

export const passwordSchema = z
  .string({ required_error: "Campo obrigatório" })
  .min(PASSWORD_MIN_LENGTH, `Mínimo ${PASSWORD_MIN_LENGTH} caracteres`)
  .max(PASSWORD_MAX_LENGTH, `Máximo ${PASSWORD_MAX_LENGTH} caracteres`)
  .refine(isValidPassword, invalidPasswordMessage);
