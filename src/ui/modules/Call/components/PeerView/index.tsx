import { User } from "@/domain/models";
import { Avatar } from "@/ui/components";
import { useAuth, useCall, useContacts, useResizable } from "@/ui/hooks";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import { audioVisualizer } from "../../helpers/audioVisualizer";
import { UserPeer } from "../../types";
import "./styles.scss";

interface PeerProps extends UserPeer {}

export function PeerView({ id, stream, channel, events }: PeerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [user, setUser] = useState<User>();
  const [hasAudio, setHasAudio] = useState(stream.getAudioTracks()[0]?.enabled);
  const [hasVideo, setHasVideo] = useState(
    "getVideoTracks" in stream && stream.getVideoTracks()[0]?.enabled
  );
  const [hasOutput, setHasOutput] = useState(true);
  const [isTalking, setIsTalking] = useState(false);

  const { load: loadContact } = useContacts();
  const { setupPeerScreen } = useCall();

  const onMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);

        if (typeof message.audio === "boolean") setHasAudio(message.audio);

        if (typeof message.video === "boolean") setHasVideo(message.video);

        if (typeof message.output === "boolean") setHasOutput(message.output);

        if (typeof message.screenId !== "undefined") {
          events.emit("screen-stream", message.screenId);
          setupPeerScreen({ userId: id, streamId: message.screenId });
        }
      } catch (error) {}
    },
    [events, id, setupPeerScreen]
  );

  useEffect(() => {
    loadContact(id).then(setUser);
  }, [id, loadContact]);

  useEffect(() => {
    channel.onmessage = onMessage;
  }, [channel, onMessage]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;

    const interval = audioVisualizer(stream, setIsTalking);

    return () => {
      clearInterval(interval);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useResizable(containerRef, ({ width }) => {
    const container = containerRef.current;
    if (!container) return;

    width < 400
      ? container.classList.add("call-peer--md")
      : container.classList.remove("call-peer--md");

    width < 300
      ? container.classList.add("call-peer--sm")
      : container.classList.remove("call-peer--sm");
  });

  return (
    <div
      ref={containerRef}
      className={`call-peer${isTalking ? " call-peer--active" : ""}`}
    >
      <video
        ref={videoRef}
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

PeerView.Self = forwardRef<HTMLDivElement, SelfPeerViewProps>(
  ({ hasVideo }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [isTalking, setIsTalking] = useState(false);

    const { user } = useAuth();
    const { mediaStream } = useCall();

    useEffect(() => {
      let interval: NodeJS.Timeout;

      if (mediaStream && videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        interval = audioVisualizer(mediaStream, setIsTalking);
      }

      return () => {
        clearInterval(interval);
      };
    }, [mediaStream]);

    useResizable(containerRef, ({ width }) => {
      const container = containerRef.current;
      if (!container) return;

      width < 400
        ? container.classList.add("call-peer--md")
        : container.classList.remove("call-peer--md");

      width < 300
        ? container.classList.add("call-peer--sm")
        : container.classList.remove("call-peer--sm");
    });

    return (
      <div
        ref={containerRef}
        className={`call-peer${isTalking ? " call-peer--active" : ""}`}
      >
        <video
          ref={videoRef}
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
  }
);

PeerView.Self.displayName = "SelfPeerView";

interface ShareScreenPeerViewProps {
  stream: MediaStream;
  username?: string;
}

PeerView.Screen = forwardRef<HTMLDivElement, ShareScreenPeerViewProps>(
  ({ stream, username }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    }, [stream]);

    return (
      <div ref={ref} className="call-peer call-peer--screen">
        <video ref={videoRef} autoPlay disablePictureInPicture muted></video>

        {username && (
          <div className="call-peer__options">
            <span className="text">Tela de @{username}</span>
          </div>
        )}
      </div>
    );
  }
);

PeerView.Screen.displayName = "ScreenPeerView";
