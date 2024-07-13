import { Call } from "./types";

const defaultConfig: RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302"],
    },
    { urls: "turns:freestun.tel:5350", username: "free", credential: "free" },
  ],
  iceCandidatePoolSize: 10,
};

interface RTCEvents {
  ontrack: (ev: RTCTrackEvent) => void;
  onicecandidate: (ev: RTCPeerConnectionIceEvent) => void;
  ondatachannel:
    | ((this: RTCPeerConnection, ev: RTCDataChannelEvent) => any)
    | null;
  onnegotiationneeded: () => void;
  oniceconnectionstatechange: () => void;
}

export class Peer {
  private readonly connection: RTCPeerConnection;

  constructor() {
    this.connection = new RTCPeerConnection(defaultConfig);
    this.connection.oniceconnectionstatechange;
  }

  get signalingState() {
    return this.connection.signalingState;
  }

  get iceConnectionState() {
    return this.connection.iceConnectionState;
  }

  async createOffer(): Promise<Call.Signal> {
    const signal = await this.connection.createOffer();
    await this.connection.setLocalDescription(signal);

    return signal;
  }

  async createAnswer(): Promise<Call.Signal> {
    const signal = await this.connection.createAnswer();

    const description = new RTCSessionDescription(signal);
    await this.connection.setLocalDescription(description);

    return signal;
  }

  async setRemoteSignal(signal: RTCSessionDescriptionInit) {
    const description = new RTCSessionDescription(signal);
    await this.connection.setRemoteDescription(description);
  }

  on<E extends keyof RTCEvents>(event: E, handle: RTCEvents[E]) {
    this.connection[event] = handle as any;
  }

  createDataChannel(label: string) {
    return this.connection.createDataChannel(label, {
      negotiated: true,
      id: 0,
    });
  }

  addTrack(track: MediaStreamTrack, stream: MediaStream) {
    return this.connection.addTrack(track, stream);
  }

  addIceCandidate(candidate: RTCIceCandidate) {
    this.connection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  close() {
    this.connection.close();
  }

  get localDescription() {
    return this.connection.localDescription;
  }
}
