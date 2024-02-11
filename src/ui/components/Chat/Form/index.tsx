import "./styles.css";
import { MaterialSymbol } from "react-material-symbols";

export function Form() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    ///...
  };

  return (
    <form className="chat__form" onSubmit={onSubmit}>
      <button type="button" className="button__icon">
        <MaterialSymbol icon="mood" />
      </button>

      <button type="button" className="button__icon">
        <MaterialSymbol icon="expand_less" />
      </button>

      <input
        type="text"
        name="text"
        id="message-text"
        className="text"
        placeholder="Digite uma mensagem"
      />

      <button type="button" className="button__icon">
        <MaterialSymbol icon="mic" />
      </button>
    </form>
  );
}
