import { Peer } from "../WebRTC";

export interface UserPeer {
  id: string;
  peer: Peer;
  answered: boolean;
  stream: MediaStream;
  channel: RTCDataChannel;
}
