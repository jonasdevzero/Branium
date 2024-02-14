import { KeyPair } from "@/domain/models";
import { Fetch, KeyPairStorage } from "@/ui/utils";

export const keysService = Object.freeze({
  async loadKeyPair(password: string) {
    const keyPair = await Fetch.post<KeyPair>("/api/keys/pair", {
      password,
    });

    KeyPairStorage.set(keyPair);

    return keyPair;
  },

  async findPublicKey(userId: string) {
    return await Fetch.get<string | null>(`/api/keys/public/${userId}2`);
  },
});
