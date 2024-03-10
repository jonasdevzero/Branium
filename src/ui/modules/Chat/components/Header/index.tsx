import { Button, ContactSkeleton, Room } from "@/ui/components";
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
        <Button.Icon icon="videocam" />

        <Button.Icon icon="call" />

        <Button.Icon icon="more_vert" />
      </div>
    </header>
  );
}

Header.Skeleton = function Skeleton() {
  return <ContactSkeleton actions={3} />;
};
