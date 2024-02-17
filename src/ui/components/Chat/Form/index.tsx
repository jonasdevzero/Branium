import { useState } from "react";
import "./styles.css";
import { MaterialSymbol } from "react-material-symbols";

export interface SubmitMessageProps {
  text?: string;
  files: File[];
}

interface FormProps {
  onSubmit(data: SubmitMessageProps): void;
}

export function Form({ onSubmit }: FormProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit({ text, files: [] });
    setText("");
  };

  return (
    <form className="chat__form" onSubmit={handleSubmit}>
      <button type="button" className="button__icon">
        <MaterialSymbol icon="mood" />
      </button>

      <button type="button" className="button__icon">
        <MaterialSymbol icon="expand_less" />
      </button>

      <textarea
        name="text"
        id="message-text"
        className="text"
        placeholder="Digite uma mensagem"
        autoFocus
        contentEditable="true"
        autoComplete="false"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.code === "Enter" && e.shiftKey) return true;

          if (e.code === "Enter" || e.code === "NumpadEnter") {
            e.preventDefault();
            onSubmit({ text, files: [] });
            setText("");
            return false;
          }
        }}
      />

      <button type="button" className="button__icon">
        <MaterialSymbol icon="mic" />
      </button>
    </form>
  );
}
