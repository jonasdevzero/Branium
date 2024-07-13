"use client";

import { User } from "@/domain/models";
import { Avatar, Button } from "@/ui/components";
import { useAuth, useCall, useContacts } from "@/ui/hooks";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import { audioVisualizer } from "../../helpers/audioVisualizer";
import { UserPeer } from "../../types";
import "./styles.scss";

export function CallView() {
  const selfRef = useRef<HTMLVideoElement>(null);

  const pathname = usePathname();
  const { user } = useAuth();
  const { mediaStream, peers, ...call } = useCall();

  const [hasAudio, setHasAudio] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [isTalking, setIsTalking] = useState(false);

  const users = useMemo(
    () =>
      peers
        .filter((peer) => peer.answered)
        .map((peer) => <PeerView key={peer.id} {...peer} />),
    [peers]
  );

  const sendMessage = useCallback(
    (data: { audio?: boolean; video?: boolean }) => {
      const parsedData = JSON.stringify(data);

      peers.forEach(({ channel }) => channel.send(parsedData));
    },
    [peers]
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (mediaStream && selfRef.current) {
      selfRef.current.srcObject = mediaStream;
      interval = audioVisualizer(mediaStream, setIsTalking);
    }

    if (mediaStream) {
      setHasAudio(mediaStream.getAudioTracks()[0].enabled);
      setHasVideo(mediaStream?.getVideoTracks()?.[0]?.enabled);
    }

    return () => {
      clearInterval(interval);
    };
  }, [mediaStream]);

  const toggleMic = useCallback(() => {
    if (!mediaStream) return;

    const nextValue = !mediaStream.getAudioTracks()[0].enabled;

    sendMessage({ audio: nextValue });

    mediaStream.getAudioTracks()[0].enabled = nextValue;
    setHasAudio((value) => !value);
  }, [mediaStream, sendMessage]);

  const toggleCamera = useCallback(async () => {
    if (!mediaStream) return;

    if (typeof mediaStream.getVideoTracks()[0] === "undefined") {
      const stream = await call.loadMediaStream({ audio: false, video: true });

      if (!stream) return;

      stream.getTracks().forEach((track) => {
        mediaStream.addTrack(track);
        peers.forEach(({ peer }) => peer.addTrack(track, mediaStream));
      });

      sendMessage({ video: true });
      setHasVideo(true);
      return;
    }

    const nextValue = !mediaStream.getVideoTracks()[0].enabled;

    mediaStream.getVideoTracks()[0].enabled = nextValue;
    setHasVideo((value) => !value);
    sendMessage({ video: nextValue });
  }, [call, mediaStream, peers, sendMessage]);

  const canShow =
    call.state === "in-call" && mediaStream && pathname === "/call";

  return (
    <div className={`call-container ${canShow ? " call-container--show" : ""}`}>
      <div className="call-container__users">
        {users}

        <div className={`call-user${isTalking ? " call-user--active" : ""}`}>
          <video
            ref={selfRef}
            autoPlay
            disablePictureInPicture
            controls={false}
            muted
            className={!hasVideo ? "disabled" : ""}
          ></video>

          <div className="call-user__info">
            <Avatar {...user} alt={`foto de ${user.name}`} />
          </div>

          <div className="call-user__options">
            <span className="text" title={`@${user.username}`}>
              {user.name}
            </span>
          </div>
        </div>
      </div>

      <div className="call-container__control">
        <Button.Icon icon={"settings"} />

        <Button.Icon icon={"person_add"} />

        <span className="call-container__control__line"></span>

        <div className="call-container__control__group">
          <Button.Icon icon={"headset"} />

          <Button.Icon icon={"screen_share"} />

          <Button.Icon
            icon={hasAudio ? "mic" : "mic_off"}
            onClick={toggleMic}
          />

          <Button.Icon
            icon={hasVideo ? "videocam" : "videocam_off"}
            onClick={toggleCamera}
          />
        </div>

        <span className="call-container__control__line"></span>

        <Button.Icon icon="call_end" onClick={call.leave} />
      </div>
    </div>
  );
}

interface PeerProps extends UserPeer {}

function PeerView({ id, stream, channel }: PeerProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [user, setUser] = useState<User>();
  const [hasAudio, setHasAudio] = useState(stream.getAudioTracks()[0]?.enabled);
  const [hasVideo, setHasVideo] = useState(
    "getVideoTracks" in stream && stream.getVideoTracks()[0]?.enabled
  );
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

        if (typeof message.audio === "boolean") {
          setHasAudio(message.audio);
          return;
        }

        if (typeof message.video === "boolean") {
          setHasVideo(message.video);
          return;
        }
      } catch (error) {}
    };

    const interval = audioVisualizer(stream, setIsTalking);

    return () => {
      clearInterval(interval);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`call-user${isTalking ? " call-user--active" : ""}`}>
      <video
        ref={ref}
        autoPlay
        disablePictureInPicture
        controls={false}
        className={!hasVideo ? "disabled" : ""}
      ></video>

      {user && (
        <div className="call-user__info">
          <Avatar {...user} alt={`foto de ${user.name}`} />
        </div>
      )}

      <div className="call-user__options">
        {user && (
          <span className="text" title={`@${user.username}`}>
            {user.name}
          </span>
        )}

        <MaterialSymbol icon={hasAudio ? "mic" : "mic_off"} />
      </div>
    </div>
  );
}
