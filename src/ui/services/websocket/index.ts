import Socket from "./Socket";

const url = process.env.WEBSOCKET_URL || "ws://localhost:4000";

export const socket = new Socket(url, "chat");
