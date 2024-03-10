import { useAuth } from "@/ui/hooks";
import { toast } from "@/ui/modules";
import { useCallback, useEffect, useRef, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import { convertSecondsToMinutes } from "../..";
import "./styles.css";

interface Props {
  canRecord: boolean;
  stopRecording(): void;
  onRecord(audio: File): void;
}

const audioType = "audio/ogg; codecs=opus";
const maxAudioTime = 120; // 2 minutes;

export function AudioRecorder({ canRecord, stopRecording, onRecord }: Props) {
  const { user } = useAuth();
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const stop = useCallback(() => {
    if (recorder) {
      recorder.stop();
      setRecorder(null);
    }

    setRecordingTime(0);
    setIsRecording(false);
    stopRecording();
  }, [recorder, stopRecording]);

  const start = useCallback(async () => {
    if (!MediaRecorder.isTypeSupported(audioType)) {
      toast.error(
        `Seu navegador não suporta gravar audio no formato: ${audioType}`,
        { id: "mic-error" }
      );
      stop();

      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 256;
      source.connect(analyser);

      const chunks: Blob[] = [];
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      let interval: NodeJS.Timeout | undefined = undefined;

      const visualize = () => {
        analyser.getByteFrequencyData(dataArray);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / dataArray.length) * 3;
        let barHeight;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
          barHeight = dataArray[i] / 2;

          ctx.fillStyle = `rgb(${x}, ${barHeight + 90}, ${x + 80})`;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

          x += barWidth + 1;
        }
      };

      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (!event.data || !event.data.size) return;

        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const filename = `${Date.now()}-${user.username}-audio`;
        const blob = new Blob(chunks, { type: audioType });
        const file = new File([blob], filename, { type: audioType });

        clearInterval(interval);
        stream.getTracks().forEach((track) => track.stop());

        stop();
        onRecord(file);
      };

      recorder.start();
      setRecorder(recorder);
      setIsRecording(true);

      interval = setInterval(visualize, 50);
    } catch (error) {
      const err = error as Error;
      stop();

      if (err.message.includes("The request is not allowed")) {
        toast.info("Permita o acesso ao seu microfone para gravar.", {
          id: "mic-error",
        });
        return;
      }

      toast.error("Ocorreu algum problema ao conectar com o microfone", {
        id: "mic-error",
      });
    }
  }, [onRecord, stop, user.username]);

  const playPause = useCallback(() => {
    if (!recorder) return;

    isRecording ? recorder.pause() : recorder.resume();
    setIsRecording(!isRecording);
  }, [isRecording, recorder]);

  useEffect(() => {
    if (canRecord && !recorder) start();
  }, [canRecord, recorder, start]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRecording)
      interval = setInterval(() => setRecordingTime((t) => t + 1), 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  useEffect(() => {
    if (recordingTime >= maxAudioTime) stop();
  }, [recordingTime, stop]);

  if (!canRecord || !recorder) return null;

  return (
    <div className="overlay">
      <div className="record__container">
        <canvas
          ref={canvasRef}
          width="312"
          height="160"
          className="audio__visualizer"
        />

        <b className="text">{convertSecondsToMinutes(recordingTime + 1)}</b>

        <div className="record__actions">
          <button
            type="button"
            onClick={playPause}
            className="button icon__button"
            title={isRecording ? "pausar" : "play"}
          >
            {isRecording ? (
              <MaterialSymbol icon="pause" />
            ) : (
              <MaterialSymbol icon="play_arrow" />
            )}
          </button>

          <button
            type="button"
            onClick={stop}
            className="button icon__button stop__recording"
            title="finalizar gravação"
          >
            <MaterialSymbol icon="stop" />
          </button>
        </div>
      </div>
    </div>
  );
}
