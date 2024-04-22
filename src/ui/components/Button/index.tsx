import "./styles.css";
import { ButtonHTMLAttributes } from "react";
import { MaterialSymbol, MaterialSymbolProps } from "react-material-symbols";
import { LoadingSpinner } from "..";

export type ButtonTheme = "default" | "danger";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  theme?: ButtonTheme;
}

export function Button({ isLoading, theme, ...props }: Props) {
  return (
    <button
      type="button"
      {...props}
      className={`button ${props.className || ""} ${theme || "default"}`}
      disabled={props.disabled || isLoading}
    >
      {isLoading ? <LoadingSpinner /> : props.children}
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
