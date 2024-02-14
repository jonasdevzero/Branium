"use client";

import { LoginUserDTO } from "@/domain/dtos";
import { ApiError } from "@/domain/models";
import { Form } from "@/ui/components";
import { toast } from "@/ui/modules";
import { authServices } from "@/ui/services";
import { hasCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (hasCookie("access")) router.replace("/channels");
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserDTO>();

  const onSubmit = useCallback(
    async (data: LoginUserDTO) => {
      if (isLoading) return;
      setIsLoading(true);

      try {
        await authServices.login(data);
        router.replace("/channels");
      } catch (e) {
        const error = e as ApiError;

        if (error.statusCode >= 400 && error.statusCode < 500)
          toast.error("username ou senha inválida");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, router]
  );

  return (
    <Form title="Entrar" onSubmit={handleSubmit(onSubmit)}>
      <fieldset>
        <Form.Input
          field="username"
          error={errors.username?.message}
          {...register("username")}
        />

        <Form.Input field="senha" {...register("password")} type="password" />
      </fieldset>

      <button type="submit" className="text" disabled={isLoading}>
        entrar
      </button>

      <Link href={"/recover-password"}>Esqueceu a senha?</Link>
    </Form>
  );
}
