import React, { useMemo } from "react";
import { FormPhoto } from "./components";
import "./styles.css";

type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  title: string;
  children: React.ReactNode;
};

export function Form({ title, children, ...props }: FormProps) {
  return (
    <form {...props}>
      <h3 className="header3">{title}</h3>

      {children}
    </form>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  field: string;
  error?: string;
  name: string;
};

Form.Input = React.forwardRef<HTMLLabelElement, InputProps>((props, ref) => {
  const { field, error, ...rest } = useMemo(() => props, [props]);

  return (
    <label
      ref={ref}
      htmlFor={props.name}
      className={`form__label ${!!error && "label__error"}`}
    >
      <p>
        {field}{" "}
        {!!error && <b className="error__message description">{error}</b>}
      </p>

      <input id={props.name} {...rest} />
    </label>
  );
});

Form.Input.displayName = "FormInput";

type CheckboxProps = Omit<InputProps, "field" | "register"> & {
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

Form.Photo = FormPhoto;
