import { Form } from "../components";

export default function Register() {
  return (
    <Form title="Cadastro" submitLabel="cadastrar">
      <fieldset>
        <Form.Input field="username" name="username" />

        <Form.Input field="email" name="email" />

        <Form.Input field="senha" name="password" />
      </fieldset>
    </Form>
  );
}
