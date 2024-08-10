"use client";

import { Button } from "@/ui/components";
import { useAuth, useCall } from "@/ui/hooks";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PeerView } from "../PeerView";
import "./styles.scss";

export function CallView() {
  const [hasAudio, setHasAudio] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [isAllMuted, setIsAllMuted] = useState(false);

  const { user } = useAuth();
  const pathname = usePathname();

  const {
    mediaStream,
    screenStream,

    peers,
    screens,

    setScreenStream,
    ...call
  } = useCall();

  const canShow =
    call.state === "in-call" && mediaStream && pathname === "/call";

  const hasScreen = useMemo(
    () => !!screenStream || screens.some((s) => !!s.stream),
    [screenStream, screens]
  );

  useEffect(() => {
    if (mediaStream) {
      setHasAudio(mediaStream.getAudioTracks()[0].enabled);
      setHasVideo(mediaStream?.getVideoTracks()?.[0]?.enabled);
      setIsAllMuted(false);
    }
  }, [mediaStream]);

  const users = useMemo(
    () =>
      peers
        .filter((peer) => peer.answered)
        .map((peer) => <PeerView key={peer.id} {...peer} />),
    [peers]
  );

  const screensPeers = useMemo(
    () =>
      screens
        .filter(({ stream }) => !!stream)
        .map(({ streamId, stream }) => {
          if (!stream) return;
          return <PeerView.Screen key={streamId} stream={stream} />;
        }),
    [screens]
  );

  const sendMessage = useCallback(
    (data: any) => {
      const parsedData = JSON.stringify(data);

      peers.forEach(({ channel }) => channel.send(parsedData));
    },
    [peers]
  );

  const toggleOutput = useCallback(() => {
    if (!mediaStream) return;

    sendMessage({ audio: isAllMuted, output: isAllMuted });

    mediaStream.getAudioTracks()[0].enabled = isAllMuted;

    peers.forEach((peer) => {
      peer.stream
        .getAudioTracks()
        .forEach((track) => (track.enabled = isAllMuted));
    });

    setHasAudio(isAllMuted);
    setIsAllMuted(!isAllMuted);
  }, [isAllMuted, mediaStream, peers, sendMessage]);

  const toggleMic = useCallback(() => {
    if (!mediaStream) return;

    const nextValue = !mediaStream.getAudioTracks()[0].enabled;

    sendMessage({ audio: nextValue, output: nextValue || undefined });

    mediaStream.getAudioTracks()[0].enabled = nextValue;
    setHasAudio((value) => !value);
    setIsAllMuted(false);
  }, [mediaStream, sendMessage]);

  const toggleCamera = useCallback(async () => {
    if (!mediaStream) return;

    if (typeof mediaStream.getVideoTracks()[0] === "undefined") {
      const stream = await call.loadMedia({ audio: false, video: true });

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

  const toggleShareScreen = useCallback(async () => {
    if (screenStream) {
      sendMessage({ screenId: null });

      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(undefined);

      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      sendMessage({ screenId: stream.id });

      stream.getTracks().forEach((track) => {
        track.onended = () => {
          setScreenStream(undefined);
          sendMessage({ screenId: null });
        };

        peers.forEach(({ peer }) => peer.addTrack(track, stream));
      });

      setScreenStream(stream);
    } catch (error) {
      // ...
    }
  }, [peers, screenStream, sendMessage, setScreenStream]);

  return (
    <div className={`call-container ${canShow ? " call-container--show" : ""}`}>
      <div className="call-container__peers">
        {hasScreen && (
          <div className="call-container__screens">
            {screenStream && (
              <PeerView.Screen username={user.username} stream={screenStream} />
            )}
            {screensPeers}
          </div>
        )}

        <div
          className={`
            call-container__users
            ${hasScreen && "call-container__users--short"}
          `}
        >
          {users}

          <PeerView.Self hasVideo={hasVideo} />
        </div>
      </div>

      <div className="call-container__control">
        <Button.Icon icon={"settings"} />

        <Button.Icon icon={"person_add"} />

        <span className="call-container__control__line"></span>

        <div className="call-container__control__group">
          <Button.Icon
            icon={isAllMuted ? "headset_off" : "headset"}
            onClick={toggleOutput}
          />

          <Button.Icon
            icon={screenStream ? "stop_screen_share" : "screen_share"}
            onClick={toggleShareScreen}
          />

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
