import { Form } from "../../components";

export default function Login() {
  return (
    <Form title="Entrar" submitLabel="entrar">
      <fieldset>
        <Form.Input field="username" name="username" />

        <Form.Input field="senha" name="password" />
      </fieldset>
    </Form>
  );
}
