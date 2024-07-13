const speechThreshold = 17;

export function audioVisualizer(
  stream: MediaStream,
  cb: (playing: boolean) => void
) {
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();

  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);

  return setInterval(() => {
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const averageVolume = sum / bufferLength;

    cb(averageVolume > speechThreshold);
  }, 200);
}
