import { User } from "@/domain/models";
import { Avatar } from "@/ui/components";
import { useAuth, useCall, useContacts } from "@/ui/hooks";
import { forwardRef, useEffect, useRef, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import { audioVisualizer } from "../helpers/audioVisualizer";
import { UserPeer } from "../types";

interface PeerProps extends UserPeer {}

export function PeerView({ id, stream, channel }: PeerProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [user, setUser] = useState<User>();
  const [hasAudio, setHasAudio] = useState(stream.getAudioTracks()[0]?.enabled);
  const [hasVideo, setHasVideo] = useState(
    "getVideoTracks" in stream && stream.getVideoTracks()[0]?.enabled
  );
  const [hasOutput, setHasOutput] = useState(true);
  const [isTalking, setIsTalking] = useState(false);

  const { load: loadContact } = useContacts();

  useEffect(() => {
    loadContact(id).then(setUser);
  }, [id, loadContact]);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;

    channel.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (typeof message.audio === "boolean") setHasAudio(message.audio);

        if (typeof message.video === "boolean") setHasVideo(message.video);

        if (typeof message.output === "boolean") setHasOutput(message.output);
      } catch (error) {}
    };

    const interval = audioVisualizer(stream, setIsTalking);

    return () => {
      clearInterval(interval);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`call-peer${isTalking ? " call-peer--active" : ""}`}>
      <video
        ref={ref}
        autoPlay
        disablePictureInPicture
        controls={false}
        className={!hasVideo ? "disabled" : ""}
      ></video>

      {user && (
        <div className="call-peer__info">
          <Avatar {...user} alt={`foto de ${user.name}`} />
        </div>
      )}

      <div className="call-peer__options">
        {user && (
          <span className="text" title={`@${user.username}`}>
            {user.name}
          </span>
        )}

        <div className="call-peer__options__icons">
          <MaterialSymbol icon={hasOutput ? "headset" : "headset_off"} />
          <MaterialSymbol icon={hasAudio ? "mic" : "mic_off"} />
        </div>
      </div>
    </div>
  );
}

interface SelfPeerViewProps {
  hasVideo: boolean;
}

PeerView.Self = forwardRef<unknown, SelfPeerViewProps>(({ hasVideo }) => {
  const selfRef = useRef<HTMLVideoElement>(null);

  const [isTalking, setIsTalking] = useState(false);

  const { user } = useAuth();
  const { mediaStream } = useCall();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (mediaStream && selfRef.current) {
      selfRef.current.srcObject = mediaStream;
      interval = audioVisualizer(mediaStream, setIsTalking);
    }

    return () => {
      clearInterval(interval);
    };
  }, [mediaStream]);

  return (
    <div className={`call-peer${isTalking ? " call-peer--active" : ""}`}>
      <video
        ref={selfRef}
        autoPlay
        disablePictureInPicture
        controls={false}
        muted
        className={!hasVideo ? "disabled" : ""}
      ></video>

      <div className="call-peer__info">
        <Avatar {...user} alt={`foto de ${user.name}`} />
      </div>

      <div className="call-peer__options">
        <span className="text" title={`@${user.username}`}>
          {user.name}
        </span>
      </div>
    </div>
  );
});

PeerView.Self.displayName = "SelfPeerView";
