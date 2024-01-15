import "./styles.css";

interface CardProps {
  onClick?: () => void;
  children: React.ReactNode;
}

export function Card({ onClick, children }: CardProps) {
  return (
    <div
      className={`card__container ${!!onClick && "card__container--action"}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

Card.Small = function CardSmall({ children }: CardProps) {
  return (
    <div className="card__container card__container--small">{children}</div>
  );
};
