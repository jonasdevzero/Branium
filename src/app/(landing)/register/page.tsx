import { Form } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Branium | Cadastro",
  description: "The WebChat with 'E2E'",
};

export default function Register() {
  return (
    <Form title="Cadastro">
      <fieldset>
        <Form.Input field="username" name="username" />

        <Form.Input field="email" name="email" />

        <Form.Input field="senha" name="password" />
      </fieldset>

      <button type="submit" className="text">
        cadastrar
      </button>
    </Form>
  );
}
