import { MaterialSymbol } from "react-material-symbols";
import { ContactSkeleton, Room } from "../..";
import "./styles.css";

interface HeaderProps {
  name: string;
  image?: string | null;
  username?: string;
}

export function Header({ name, image, username }: HeaderProps) {
  return (
    <header className="chat__header">
      <Room name={name} image={image} username={username} type="secondary" />

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

Header.Skeleton = function Skeleton() {
  return <ContactSkeleton actions={3} />;
};
