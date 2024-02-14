import { KeyPair } from "@/domain/models";
import { Fetch, KeyPairStorage } from "@/ui/utils";

export const keysServices = Object.freeze({
  async loadKeyPair(password: string) {
    const keyPair = await Fetch.post<KeyPair>("/api/keys/pair", {
      password,
    });

    KeyPairStorage.set(keyPair);

    return keyPair;
  },

  findPublicKey(userId: string) {
    return Fetch.get<string | null>(`/api/keys/public/${userId}`);
  },
});
