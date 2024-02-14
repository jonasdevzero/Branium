"use client";
import { Form } from "@/ui/components";
import { authService } from "@/ui/services";
import { RegisterUserDTO } from "@/domain/dtos";
import { ApiError } from "@/domain/models";
import { registerUserSchema } from "@/ui/validators";
import { zodResolver } from "@lib/@hookform/resolvers/zod";
import { useForm } from "@lib/react-hook-form";
import Link from "next/link";
import { useCallback, useState } from "react";

const defaultValues: RegisterUserDTO = {
  username: "",
  email: "",
  password: "",
};

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(registerUserSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = useCallback(
    async (data: RegisterUserDTO) => {
      if (isLoading) return;
      setIsLoading(true);

      try {
        await authService.registerUser(data);
        setSuccess(true);
      } catch (error) {
        const err = error as ApiError;

        if (err.message === "Username already in use") {
          return setError("username", { message: "Este username está em uso" });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, setError]
  );

  if (success) {
    return (
      <div className="message__container">
        <h1 className="header2">Sucesso!</h1>
        <p className="text">
          Foi enviado um email para você finalizar o seu cadastro, seja bem
          vindo ao Branium! Este email irá se expirar em 10 minutos, após isso
          será necessário realizar o cadastro novamente.
        </p>
      </div>
    );
  }

  return (
    <Form title="Cadastro" onSubmit={handleSubmit(onSubmit)}>
      <fieldset>
        <Form.Input
          field="username"
          error={errors.username?.message}
          autoComplete="off"
          {...register("username", {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              setValue("username", e.target.value.toLowerCase(), {
                shouldValidate: true,
              }),
          })}
        />

        <Form.Input
          field="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Form.Input
          field="senha"
          error={errors.password?.message}
          {...register("password")}
          type="password"
        />

        <Form.Checkbox name="terms" required>
          <em className="description">
            Aceitar{" "}
            <Link href={"/terms"} className="description">
              Termos de Uso
            </Link>
          </em>
        </Form.Checkbox>
      </fieldset>

      <button type="submit" className="text" disabled={isLoading}>
        cadastrar
      </button>
    </Form>
  );
}
