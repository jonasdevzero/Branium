import io from 'socket.io-client';

const WEBSOCKET_URL =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:5000';

export const socket = io(WEBSOCKET_URL, {
  autoConnect: false,
  transports: ['websocket'],
});
