import EventEmitter from "events";
import { Peer } from "../WebRTC";

export interface UserPeer {
  id: string;
  events: EventEmitter;
  peer: Peer;
  answered: boolean;
  stream: MediaStream;
  channel: RTCDataChannel;
}
