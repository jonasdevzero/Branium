import "./styles.css";

interface FormProps {
  title: string;
  children: React.ReactNode;
}

export function Form({ title, children }: FormProps) {
  return (
    <form>
      <h3 className="header3">{title}</h3>

      {children}
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
