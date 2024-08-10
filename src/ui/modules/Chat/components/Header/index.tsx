import {
  Button,
  ContactSkeleton,
  Popover,
  PopoverItem,
  Room,
} from "@/ui/components";
import "./styles.css";
import { useCall } from "@/ui/hooks";
import { RoomType } from "@/domain/models";

interface HeaderProps {
  channel: {
    id: string;
    type: RoomType;
    name: string;
    image?: string | null;
    username?: string;
  };

  options: PopoverItem[];
  hasBlock?: boolean;
}

export function Header({ channel, options, hasBlock }: HeaderProps) {
  const call = useCall();

  return (
    <header className="chat__header">
      <Room {...channel} type="secondary" />

      <div className="actions">
        <Button.Icon
          icon="videocam"
          disabled={hasBlock}
          onClick={() =>
            call.start({
              type: channel.type,
              channelId: channel.id,
              media: { audio: true, video: true },
            })
          }
        />

        <Button.Icon
          icon="call"
          disabled={hasBlock}
          onClick={() =>
            call.start({
              type: channel.type,
              channelId: channel.id,
              media: { audio: true, video: false },
            })
          }
        />

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
