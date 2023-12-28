import { Form } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Branium | Redefinir senha",
  description: "The WebChat with 'E2E'",
};

export default function ResetPassword() {
  return (
    <Form title="Redefinir senha">
      <fieldset>
        <Form.Input field="confirmar username" name="username" />

        <Form.Input field="senha" name="password" type="password" />

        <Form.Input
          field="confirmar senha"
          name="confirmPassword"
          type="password"
        />
      </fieldset>

      <button type="submit" className="text">
        redefinir
      </button>
    </Form>
  );
}
