"use client";
import { Button } from "@/ui/components";
import { convertSecondsToMinutes } from "@/ui/modules/Chat";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./styles.css";

interface Props {
  src: File | string;
}

export function AudioPlayer({ src }: Props) {
  const isFile = src instanceof File;

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBar = useRef<HTMLInputElement>(null);

  const url = useMemo(
    () => (isFile ? URL.createObjectURL(src) : src),
    [isFile, src]
  );

  const togglePlayPause = useCallback(() => {
    isPlaying ? audioRef.current?.pause() : audioRef.current?.play();

    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleSpeed = useCallback(() => {
    if (!audioRef.current) return;

    const newSpeed = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1;
    audioRef.current!.playbackRate = newSpeed;
    setSpeed(newSpeed);
  }, [speed]);

  useLayoutEffect(() => {
    if (audioRef.current && progressBar.current) {
      audioRef.current.addEventListener("timeupdate", () => {
        const currentTime = Math.floor(audioRef.current?.currentTime || 0);

        progressBar.current!.value = currentTime.toString();
        setCurrentTime(currentTime);
      });

      audioRef.current.addEventListener("ended", () => {
        progressBar.current!.value = "0";
        setIsPlaying(false);
        setCurrentTime(0);
      });

      progressBar.current.addEventListener("change", () => {
        audioRef.current!.currentTime = Number(progressBar.current!.value);
      });
    }
  }, []);

  return (
    <div className="audio__player">
      <audio
        ref={audioRef}
        src={url}
        onLoad={() => (isFile ? URL.revokeObjectURL(url) : null)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
      />

      <Button.Icon
        icon={isPlaying ? "pause" : "play_arrow"}
        onClick={togglePlayPause}
      />

      <div className="range__container">
        <input
          ref={progressBar}
          type="range"
          defaultValue={0}
          step={1}
          max={Math.ceil(duration) - 1}
        />
      </div>

      <span className="description audio__time">
        {convertSecondsToMinutes(currentTime)}{" "}
        <span>/ {convertSecondsToMinutes(duration)}</span>
      </span>

      <Button className="speed description" onClick={toggleSpeed}>
        {speed}
      </Button>
    </div>
  );
}
