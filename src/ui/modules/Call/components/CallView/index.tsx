"use client";

import { Button } from "@/ui/components";
import { useCall } from "@/ui/hooks";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PeerView } from "../PeerView";
import "./styles.scss";

export function CallView() {
  const { mediaStream, peers, ...call } = useCall();
  const pathname = usePathname();

  const [hasAudio, setHasAudio] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [isAllMuted, setIsAllMuted] = useState(false);

  const canShow =
    call.state === "in-call" && mediaStream && pathname === "/call";

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

  const sendMessage = useCallback(
    (data: { audio?: boolean; video?: boolean; output?: boolean }) => {
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

    sendMessage({ audio: nextValue });

    mediaStream.getAudioTracks()[0].enabled = nextValue;
    setHasAudio((value) => !value);
    setIsAllMuted(false);
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

  return (
    <div className={`call-container ${canShow ? " call-container--show" : ""}`}>
      <div className="call-container__users">
        {users}

        <PeerView.Self hasVideo={hasVideo} />
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
