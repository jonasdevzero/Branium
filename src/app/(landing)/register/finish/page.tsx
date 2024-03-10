"use client";
import { FinishUserRegisterDTO } from "@/domain/dtos";
import { ApiError } from "@/domain/models";
import { Form } from "@/ui/components";
import { isEmail } from "@/ui/helpers";
import { authServices } from "@/ui/services";
import { finishRegisterUserSchema } from "@/ui/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function FinishRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!email || !token || !isEmail(email)) {
    notFound();
  }

  const [image, setImage] = useState<File>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FinishUserRegisterDTO>({
    defaultValues: { email, token },
    resolver: zodResolver(finishRegisterUserSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = useCallback(
    async (data: FinishUserRegisterDTO) => {
      if (isLoading) return;
      setIsLoading(true);

      try {
        await authServices.finishRegister({ ...data, image });

        router.replace("/login");
        toast.success("Cadastro finalizado!");
      } catch (e) {
        const err = e as ApiError;

        if (err.message === "Invalid token") {
          toast.error("Token inválido! tente se cadastrar novamente.");
        }

        if (err.message === "Expired token") {
          toast.error("Token expirado! tente se cadastrar novamente.");
        }

        if (err.message === "User already exists") {
          toast.error("Conta já criada!");
        }

        return router.replace("/register");
      } finally {
        setIsLoading(false);
      }
    },
    [image, isLoading, router]
  );

  return (
    <Form title="Finalizar Cadastro" onSubmit={handleSubmit(onSubmit)}>
      <fieldset>
        <Form.Input
          field="nome"
          error={errors.name?.message}
          {...register("name")}
        />

        <Form.Photo field="foto (opcional)" name="image" onSelect={setImage} />
      </fieldset>

      <button type="submit" className="button text" disabled={isLoading}>
        finalizar
      </button>
    </Form>
  );
}
