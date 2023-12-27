import "./styles.css";

interface FormProps {
  title: string;
  children: React.ReactNode;

  submitLabel: string;
}

export function Form({ title, children, submitLabel }: FormProps) {
  return (
    <form>
      <h3 className="header3">{title}</h3>

      {/* add custom gap to children */}
      {children}

      <button type="submit" className="text">
        {submitLabel}
      </button>
    </form>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  field: string;
};

Form.Input = function Input({ field, ...props }: InputProps) {
  return (
    <label htmlFor={props.name}>
      {field}
      <input {...props} />
    </label>
  );
};
