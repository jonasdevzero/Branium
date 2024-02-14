import { findPublicKey } from "./findPublicKey";
import { loadKeyPair } from "./loadKeyPair";

export const keysService = Object.freeze({
  loadKeyPair,
  findPublicKey,
});
