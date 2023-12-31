const kEvents = Symbol("kEvents");
const kAttachEvents = Symbol("kAttachEvents");

type SocketFn = (...args: any[]) => void;

export default class Socket {
  raw!: WebSocket;
  url: string;
  protocol: string;
  [kEvents] = new Map();

  isConnected = false;
  isConnecting = false;

  constructor(url: string, protocol: string) {
    this.url = url;
    this.protocol = protocol;
  }

  async connect() {
    if (this.isConnecting || this.isConnected) return;
    this.isConnecting = true;

    return new Promise<void>((resolve, reject) => {
      this.raw = new WebSocket(this.url, this.protocol);

      this.raw.onerror = () => {
        this.isConnecting = false;
        this.isConnected = false;
        reject("Error during the connection!");
      };

      this.raw.onopen = () => {
        this.isConnected = true;
        this.isConnecting = false;

        this[kAttachEvents]();
        resolve();
      };
    });
  }

  [kAttachEvents]() {
    this.raw.onmessage = (e) => {
      let { event, message } = JSON.parse(e.data);

      message = message.map((m: unknown, i: number) =>
        m === `${event}::callback:${i}`
          ? (...args: unknown[]) => this.emit(m, ...args)
          : m
      );

      const eventFn = this[kEvents].get(event) || function () {};
      eventFn(...message);
    };

    this.raw.onerror = (e) => {
      console.error("error on socket", e);
    };

    this.raw.onclose = (e) => {
      this.isConnected = false;
    };
  }

  on(event: string, fn: SocketFn) {
    this[kEvents].set(event, fn);
    return this;
  }

  off(event: string) {
    this[kEvents].delete(event);
  }

  once(event: string, fn: SocketFn) {
    this[kEvents].set(event, (...args: unknown[]) => {
      fn(...args);
      this[kEvents].delete(event);
    });

    return this;
  }

  emit(event: string, ...args: unknown[]) {
    if (!this.isConnected) return;

    const message = args.map((argument, i) => {
      if (typeof argument == "function") {
        const callbackEvent = `${event}::callback:${i}`;
        this.once(callbackEvent, (message) => argument(message));

        return callbackEvent;
      }

      return argument;
    });

    this.raw.send(JSON.stringify({ event, message }));
    return this;
  }

  disconnect() {
    if (!this.isConnected || !this.isConnecting) return;

    this.isConnected = false;
    this.isConnecting = false;
    this.raw.close();
    return this;
  }
}
