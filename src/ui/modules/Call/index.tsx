"use client";

import { useAuth, useContacts } from "@/ui/hooks";
import { Alert } from "@/ui/utils";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "../Toaster";
import { Peer } from "./WebRTC";
import { CallingView, IncomeCallView } from "./components";
import { Call, UserPeer } from "./types";

interface CallContextProps {
  state: Call.State;
  mediaStream: MediaStream | undefined;
  peers: UserPeer[];

  start(data: Call.Start): void;
  loadMediaStream(media: Call.Media): Promise<MediaStream | null>;
  leave(): void;
}

export const CallContext = createContext({} as CallContextProps);

interface Props {
  children: React.ReactNode;
}

export function CallProvider({ children }: Props) {
  const [state, setState] = useState<Call.State>("disabled");
  const [peers, setPeers] = useState<UserPeer[]>([]);

  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const [callingTarget, setCallingTarget] = useState<Call.CallingTarget>();
  const [incomeCall, setIncomeCall] = useState<Call.Income>();
  const [answerTimeout, setAnswerTimeout] = useState<NodeJS.Timeout>();

  const router = useRouter();
  const { socket } = useAuth();
  const { load: loadContact } = useContacts();

  const removePeer = useCallback(
    async (id: string) => {
      try {
        const contact = await loadContact(id);

        setPeers((peers) => peers.filter((peer) => peer.id !== id));

        toast.info(`@${contact.username} caiu da ligação!`);
      } catch (error) {
        // ...
      }
    },
    [loadContact]
  );

  const createPeer = useCallback(
    (id: string, localStream: MediaStream): UserPeer => {
      const peer = new Peer();
      const remoteStream = new MediaStream();
      const channel = peer.createDataChannel("data");

      peer.on("ontrack", (event): void => {
        remoteStream.addTrack(event.track);
      });

      peer.on("onicecandidate", (event): void => {
        if (!event.candidate) return;

        socket.emit("call:ice-candidate", { id, candidate: event.candidate });
      });

      peer.on("onnegotiationneeded", async () => {
        if (peer.signalingState !== "stable") return;

        const signal = await peer.createOffer();
        socket.emit("call:connect", { id, signal });
      });

      peer.on("oniceconnectionstatechange", () => {
        const state = peer.iceConnectionState;

        if (state === "disconnected") removePeer(id);
      });

      localStream
        .getTracks()
        .forEach((track) => peer.addTrack(track, localStream));

      return {
        id,
        peer,
        answered: false,
        stream: remoteStream,
        channel,
      };
    },
    [removePeer, socket]
  );

  const loadMedia = useCallback(async (media: Call.Media) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(media);
      return stream;
    } catch (error) {
      const { audio, video } = media;

      const mic = audio ? "microfone" : "";
      const cam = video ? "câmera" : "";
      const divisor = audio && video ? " e " : "";

      toast.error(`Permista acesso a ${mic + divisor + cam}!`, {
        id: "call:request-media",
      });

      return null;
    }
  }, []);

  const closeMedia = useCallback(() => {
    if (!mediaStream) return;
    mediaStream.getTracks().forEach((track) => track.stop());
  }, [mediaStream]);

  const createOffers = useCallback(async (users: UserPeer[]) => {
    const offers = await Promise.all(
      users.map<Promise<Call.Connection>>(async ({ id, peer }) => {
        const signal = await peer.createOffer();

        return { id, signal };
      })
    );

    return offers;
  }, []);

  const cancel = useCallback(async () => {
    const hasAnswered = peers.some((peer) => peer.answered);
    if (hasAnswered) return;

    const users = peers.map((peer) => peer.id);

    socket.emit("call:cancel", users);

    closeMedia();

    clearTimeout(answerTimeout);
    setPeers([]);
    setState("disabled");
  }, [answerTimeout, closeMedia, peers, socket]);

  const start = useCallback(
    async (data: Call.Start) => {
      const localStream = await loadMedia(data.media);
      if (!localStream) return;

      setMediaStream(localStream);

      try {
        const { type, channelId, media } = data;

        const users = [];

        if (type === "CONTACT") {
          users.push(channelId);
          const contact = await loadContact(channelId);

          setCallingTarget({
            type: "CONTACT",
            name: contact.customName || contact.name,
            username: contact.username,
            image: contact.image,
          });
        }

        const userPeers = users.map((id) => createPeer(id, localStream));

        const connections = await createOffers(userPeers);

        connections.forEach((connection) => {
          socket.emit("call:start", { connection, media });
        });

        setState("calling");
        setPeers(userPeers);

        const awaitTimeout = setTimeout(() => {
          cancel();
          toast.info("Ligação nao respondida!", { id: "call:canceled" });

          setAnswerTimeout(undefined);
        }, 1000 * 60);

        setAnswerTimeout(awaitTimeout);
      } catch (error) {
        toast.error("Parece que não foi possível iniciar a chamada!", {
          id: "call:start",
        });

        closeMedia();
      }
    },
    [
      cancel,
      closeMedia,
      createOffers,
      createPeer,
      loadContact,
      loadMedia,
      socket,
    ]
  );

  const answer = useCallback(
    async (accept: boolean) => {
      if (!incomeCall) return;

      const { from, signal, media } = incomeCall;

      clearTimeout(answerTimeout);
      setAnswerTimeout(undefined);

      if (!accept) {
        socket.emit("call:decline", from);
        setIncomeCall(undefined);
        setState("disabled");
        return;
      }

      const localStream = await loadMedia(media);
      if (!localStream) return;

      setMediaStream(localStream);

      try {
        const userPeer = createPeer(from, localStream);
        Object.assign(userPeer, { answered: true });

        await userPeer.peer.setRemoteSignal(signal);
        const connection = await userPeer.peer.createAnswer();

        setPeers([userPeer]);
        setIncomeCall(undefined);
        setState("in-call");
        router.push("/call");

        socket.emit("call:accept", { id: from, signal: connection });
      } catch (error) {
        console.error(error);
        toast.error("Parece que não foi possível aceitar a chamada!", {
          id: "call:start",
        });

        localStream.getTracks().forEach((track) => track.stop());
        setMediaStream(undefined);
      }
    },
    [answerTimeout, createPeer, incomeCall, loadMedia, router, socket]
  );

  const leave = useCallback(() => {
    if (state !== "in-call") return;

    Alert.create({
      title: "Deseja sair a chamada?",
      description: "",
      confirm: {
        label: "sair",
        theme: "danger",
        onClick() {
          const users = peers.map(({ id }) => id);

          peers.forEach(({ peer }) => peer.close());

          socket.emit("call:leave", users);

          router.push("/channels");
          setPeers([]);
          setState("disabled");
          closeMedia();
        },
      },
      cancel: { label: "cancelar" },
    });
  }, [closeMedia, peers, router, socket, state]);

  const onIncome = useCallback(
    (data: Call.Income) => {
      if (incomeCall || state !== "disabled") return;

      setIncomeCall(data);
      setState("income");

      const answerTimeout = setTimeout(() => {
        cancel();
        toast.info("Ligação nao respondida!", { id: "call:canceled" });

        setAnswerTimeout(undefined);
      }, 1000 * 60);

      setAnswerTimeout(answerTimeout);
    },
    [cancel, incomeCall, state]
  );

  const onCanceled = useCallback(
    (from: string) => {
      if (!incomeCall || incomeCall.from !== from) return;

      clearTimeout(answerTimeout);
      setAnswerTimeout(undefined);

      setIncomeCall(undefined);
      setPeers([]);
      setState("disabled");
      closeMedia();

      toast.info("Ligação cancelada!", { id: "call:canceled" });
    },
    [answerTimeout, closeMedia, incomeCall]
  );

  const onConnection = useCallback(
    async (connection: Call.Connection) => {
      if (!mediaStream) return;

      const hasPeer = peers.some((peer) => peer.id === connection.id);

      if (!hasPeer) {
        const userPeer = createPeer(connection.id, mediaStream);

        await userPeer.peer.setRemoteSignal(connection.signal);
        const newConnection = await userPeer.peer.createAnswer();

        setPeers([...peers, userPeer]);

        socket.emit("call:connect", newConnection);

        return;
      }

      const { id, signal } = connection;

      const updatedPeers = await Promise.all(
        peers.map(async (userPeer) => {
          if (userPeer.id !== id) return userPeer;

          await userPeer.peer.setRemoteSignal(signal);
          Object.assign(userPeer, { answered: true });

          if (signal.type === "offer") {
            const offer = await userPeer.peer.createAnswer();
            socket.emit("call:connect", { id, signal: offer });
          }

          return userPeer;
        })
      );

      setPeers(updatedPeers);
    },
    [createPeer, mediaStream, peers, socket]
  );

  const onAccepted = useCallback(
    async (connection: Call.Connection) => {
      if (state !== "calling") return;

      try {
        clearTimeout(answerTimeout);
        setAnswerTimeout(undefined);

        await onConnection(connection);

        const connectedUsers = peers
          .filter((peer) => peer.answered && peer.id !== connection.id)
          .map((peer) => peer.id);

        if (connectedUsers.length > 0) {
          socket.emit("call:list-users", {
            id: connection.id,
            users: connectedUsers,
          });
        }

        setState("in-call");
        router.push("/call");
      } catch (error) {
        // ...
      }
    },
    [state, answerTimeout, onConnection, peers, router, socket]
  );

  const onDeclined = useCallback(
    async (userId: string) => {
      if (state !== "calling") return;

      clearTimeout(answerTimeout);
      setAnswerTimeout(undefined);

      const updatedPeers = peers.filter((peer) => peer.id !== userId);

      if (updatedPeers.length === 0) {
        setState("disabled");
        setPeers([]);
        closeMedia();

        toast.info("Ligação rejeitada!", {
          id: "call:declined",
        });
      }

      setPeers(updatedPeers);
    },
    [answerTimeout, closeMedia, peers, state]
  );

  const onListUsers = useCallback(
    async (users: string[]) => {
      if (!mediaStream) return;

      try {
        const filteredUsers = users.filter(
          (id) => !peers.some((peer) => peer.id === id)
        );

        const newPeers = filteredUsers.map((id) => createPeer(id, mediaStream));

        const connections = await createOffers(newPeers);

        socket.emit("call:connect", connections);

        setPeers([...peers, ...newPeers]);
      } catch (error) {
        // ...
      }
    },
    [createOffers, createPeer, mediaStream, peers, socket]
  );

  const onIceCandidate = useCallback(
    (data: Call.IceCandidate) => {
      const { id, candidate } = data;

      const userPeer = peers.find((peer) => peer.id === id);

      if (!userPeer || !userPeer.answered) return;

      userPeer.peer.addIceCandidate(candidate);
    },
    [peers]
  );

  const onLeave = useCallback(
    (id: string) => {
      const userPeer = peers.find((userPeer) => userPeer.id === id);
      if (!userPeer) return;

      const updatedUsers = peers.filter((userPeer) => userPeer.id !== id);

      if (updatedUsers.length === 0) {
        peers.forEach(({ peer }) => peer.close());

        setPeers([]);
        setState("disabled");
        closeMedia();
        router.push("/channels");

        toast.info("Ligação encerrada!", { id: "call:leave" });

        return;
      }

      userPeer.peer.close();
      setPeers(updatedUsers);
    },
    [closeMedia, peers, router]
  );

  useEffect(() => {
    socket.on("call:income", onIncome);
    socket.on("call:canceled", onCanceled);
    socket.on("call:accepted", onAccepted);
    socket.on("call:declined", onDeclined);
    socket.on("call:list-users", onListUsers);
    socket.on("call:connection", onConnection);
    socket.on("call:ice-candidate", onIceCandidate);
    socket.on("call:leave", onLeave);

    return () => {
      socket.off("call:income");
      socket.off("call:canceled");
      socket.off("call:accepted");
      socket.off("call:declined");
      socket.off("call:connection");
      socket.off("call:ice-candidate");
      socket.off("call:leave");
    };
  }, [
    onAccepted,
    onCanceled,
    onConnection,
    onDeclined,
    onIceCandidate,
    onIncome,
    onLeave,
    onListUsers,
    socket,
  ]);

  const context = useMemo(
    () => ({
      state,
      mediaStream,
      peers,
      start: (data: Call.Start) => {
        Alert.create({
          title: "Iniciar uma chamada?",
          description: `Deseja iniciar uma chamada de voz${
            data.media.video ? " e vídeo" : ""
          }?`,
          confirm: {
            label: "confirmar",
            onClick: () => start(data),
          },
          cancel: { label: "cancelar" },
        });
      },
      leave,
      loadMediaStream: loadMedia,
    }),
    [leave, loadMedia, mediaStream, peers, start, state]
  );

  return (
    <CallContext.Provider value={context}>
      {state === "calling" && callingTarget && (
        <CallingView target={callingTarget} onCancel={cancel} />
      )}

      {state === "income" && incomeCall && (
        <IncomeCallView income={incomeCall} onAnswer={answer} />
      )}

      {children}
    </CallContext.Provider>
  );
}
