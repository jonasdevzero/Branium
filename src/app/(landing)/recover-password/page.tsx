import { Form } from "@/ui/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Branium | Esqueci a senha",
  description: "The WebChat with 'E2E'",
};

export default function RecoverPassword() {
  return (
    <Form title="Esqueci a senha">
      <fieldset>
        <Form.Input field="username" name="username" />

        <Form.Input field="email" name="email" />
      </fieldset>

      <button type="submit" className="button text">
        recuperar
      </button>
    </Form>
  );
}
