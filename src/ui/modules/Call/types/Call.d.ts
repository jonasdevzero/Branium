import type { RoomType } from "@/domain/models";

export namespace Call {
  type Signal = RTCSessionDescriptionInit;

  type State = "disabled" | "calling" | "in-call" | "income";

  type TrackType = "audio" | "video";

  interface Media {
    audio: boolean;
    video: boolean;
  }

  interface Start {
    type: RoomType;
    channelId: string;

    media: Media;
  }

  interface CallingTarget {
    type: RoomType;

    name: string;
    username?: string;
    image?: string | null;
  }

  interface Income {
    from: string;
    signal: Signal;
    media: Media;
  }

  interface Connection {
    id: string;
    signal: Signal;
  }

  interface IceCandidate {
    id: string;
    candidate: RTCIceCandidate;
  }

  type TrackEvent = RTCTrackEvent;
}
