import { Form } from "@/ui/components";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Branium | Login",
  description: "The WebChat with 'E2E'",
};

export default function Login() {
  return (
    <Form title="Entrar">
      <fieldset>
        <Form.Input field="username" name="username" />

        <Form.Input field="senha" name="password" />
      </fieldset>

      <button type="submit" className="text">
        entrar
      </button>

      <Link href={"/recover-password"}>Esqueceu a senha?</Link>
    </Form>
  );
}
