import Image from "next/image";
import "./styles.css";
import { MaterialSymbol } from "react-material-symbols";

interface HeaderProps {
  name: string;
  image?: string | null;
}

export function Header({ name, image }: HeaderProps) {
  return (
    <header className="chat__header">
      <div className="user__info">
        <div className="user__image" aria-label="foto do usuário">
          {image ? (
            <Image src={image} width={50} height={50} alt={`foto de ${name}`} />
          ) : (
            <span>{name[0]}</span>
          )}
        </div>

        <h4 className="text">{name}</h4>
      </div>

      <div className="actions">
        <button className="button__icon">
          <MaterialSymbol icon="videocam" />
        </button>

        <button className="button__icon">
          <MaterialSymbol icon="call" />
        </button>

        <button className="button__icon">
          <MaterialSymbol icon="more_vert" />
        </button>
      </div>
    </header>
  );
}
