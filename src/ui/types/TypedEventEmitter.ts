export interface TypedEventEmitter<L, E extends Record<string, any>> {
  on<K extends keyof L>(event: K, listener: (data: L[K]) => void): void;

  off<K extends keyof L>(event: K, listener: (data: L[K]) => void): void;

  emit<K extends keyof E>(event: K, ...data: E[K]): void;
}
