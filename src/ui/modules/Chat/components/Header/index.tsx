import {
  Button,
  ContactSkeleton,
  Popover,
  PopoverItem,
  Room,
} from "@/ui/components";
import "./styles.css";

interface HeaderProps {
  name: string;
  image?: string | null;
  username?: string;
  options: PopoverItem[];
  hasBlock?: boolean;
}

export function Header({
  name,
  image,
  username,
  options,
  hasBlock,
}: HeaderProps) {
  return (
    <header className="chat__header">
      <Room name={name} image={image} username={username} type="secondary" />

      <div className="actions">
        <Button.Icon icon="videocam" disabled={hasBlock} />

        <Button.Icon icon="call" disabled={hasBlock} />

        <Popover
          options={options}
          position={{ horizontalAxis: ["left"], verticalAxis: ["bottom"] }}
        />
      </div>
    </header>
  );
}

Header.Skeleton = function Skeleton() {
  return <ContactSkeleton actions={3} />;
};
