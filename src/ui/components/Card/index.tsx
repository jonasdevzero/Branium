import "./styles.css";

interface Props {
  children: React.ReactNode;
}

export const Card: React.FC<Props> = ({ children }) => {
  return <div className="card__container">{children}</div>;
};
