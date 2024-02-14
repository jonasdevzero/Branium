import { KeyPair } from "@/domain/models";
import { Fetch, KeyPairStorage } from "@/ui/utils";

export async function loadKeyPair(password: string) {
  const keyPair = await Fetch.post<KeyPair>("/api/keys/pair", {
    password,
  });

  KeyPairStorage.set(keyPair);

  return keyPair;
}
