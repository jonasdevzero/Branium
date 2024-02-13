import { Message } from "@/domain/models";
import "./styles.css";
import { formatDate } from "@/ui/helpers";
import { Avatar, MessageSkeleton } from "@/ui/components";

interface MessageProps {
  message: Message;
  short?: boolean;
}

export function MessageComponent({ message, short }: MessageProps) {
  const { sender } = message;

  if (short && !!message.message) {
    return (
      <div id={message.id} className="message message--short">
        <p className="text">{message.message}</p>
      </div>
    );
  }

  return (
    <div id={message.id} className="message message--full">
      <Avatar
        name={sender.name}
        alt={`foto de ${sender.name}`}
        url={sender.image}
      />

      <div className="message__content">
        <div className="message__info">
          <h6 className="text">{sender.name}</h6>
          <span className="text">{formatDate(message.createdAt)}</span>
        </div>

        {!!message.message && <p className="text">{message.message}</p>}
      </div>
    </div>
  );
}

interface MessageSkeletonProps {
  amount: number;
}

MessageComponent.Skeleton = function Skeleton({
  amount,
}: MessageSkeletonProps) {
  const values = ["text", "image", "file"] as const;

  function getRandomType() {
    const randomNumber = Math.random() * 100;

    if (randomNumber < 50) {
      return values[0];
    } else if (randomNumber < 75) {
      return values[1];
    } else {
      return values[2];
    }
  }

  return new Array(amount)
    .fill("")
    .map((_, i) => <MessageSkeleton key={i} type={getRandomType()} />);
};
