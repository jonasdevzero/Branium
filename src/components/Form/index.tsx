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
      <input id={props.name} {...props} />
    </label>
  );
};

type CheckboxProps = Omit<InputProps, "field"> & {
  children: React.ReactNode;
};

Form.Checkbox = function Checkbox({ children, ...props }: CheckboxProps) {
  return (
    <label htmlFor={props.name} className="form__checkbox">
      <input id={props.name} {...props} type="checkbox" />
      {children}
    </label>
  );
};

Form.Photo = function Photo({ field, ...props }: InputProps) {
  return (
    <label htmlFor={props.name}>
      {field}
      <input id={props.name} {...props} type="file" hidden />
    </label>
  );
};
