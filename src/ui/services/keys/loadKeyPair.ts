import { KeyPair } from "@/domain/models";
import { Fetcher, KeyPairStorage } from "@/ui/utils";

export async function loadKeyPairService(password: string) {
  const keyPair = await Fetcher.post<KeyPair>("/api/keys/pair", {
    password,
  });

  KeyPairStorage.set(keyPair);

  return keyPair;
}
