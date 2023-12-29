"use client";
import { Form } from "@/components";
import { notFound, useSearchParams } from "next/navigation";

export default function FinishRegister() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!email || !token) {
    notFound();
  }

  return (
    <Form title="Finalizar Cadastro">
      <fieldset>
        <Form.Input field="nome" name="name" />

        <Form.Photo field="foto (opcional)" name="image" />
      </fieldset>

      <button type="submit" className="text">
        finalizar
      </button>
    </Form>
  );
}
