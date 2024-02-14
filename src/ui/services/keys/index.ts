import { findPublicKeyService } from "./findPublicKey";
import { loadKeyPairService } from "./loadKeyPair";

export const keysService = Object.freeze({
  loadKeyPair: loadKeyPairService,
  findPublic: findPublicKeyService,
});
