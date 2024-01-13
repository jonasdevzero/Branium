import { MaterialSymbol } from "react-material-symbols";
import { Room } from "../..";
import "./styles.css";

interface HeaderProps {
  name: string;
  image?: string | null;
}

export function Header({ name, image }: HeaderProps) {
  return (
    <header className="chat__header">
      <Room name={name} image={image} type="secondary" />

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
