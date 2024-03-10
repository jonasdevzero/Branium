import "./styles.css";
import { ButtonHTMLAttributes } from "react";
import { MaterialSymbol, MaterialSymbolProps } from "react-material-symbols";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button(props: Props) {
  return (
    <button
      type="button"
      {...props}
      className={`button ${props.className || ""}`}
    >
      {props.children}
    </button>
  );
}

Button.Small = function SmallButton(props: Props) {
  return (
    <button
      type="button"
      {...props}
      className={`button button__small ${props.className || ""}`}
    >
      {props.children}
    </button>
  );
};

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  icon?: MaterialSymbolProps["icon"];
}

Button.Icon = function IconButton({
  icon,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={`button icon__button ${props.className || ""}`}
    >
      {icon && !children ? (
        <MaterialSymbol className="icon" icon={icon} />
      ) : null}
      {children}
    </button>
  );
};
