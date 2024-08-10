import { KeyPair } from "@/domain/models";

const publicKeyName = "public-key";
const privateKeyName = "private-key";

export class KeyPairStorage {
  static set(keys: KeyPair) {
    const { publicKey, privateKey } = keys;

    sessionStorage.setItem(
      publicKeyName,
      Buffer.from(publicKey, "utf8").toString("base64")
    );

    sessionStorage.setItem(
      privateKeyName,
      Buffer.from(privateKey, "utf8").toString("base64")
    );
  }

  static getPublic() {
    const publicKey = sessionStorage.getItem(publicKeyName);

    if (!publicKey) return null;

    return Buffer.from(publicKey, "base64").toString("utf-8");
  }

  static getPrivate() {
    const privateKey = sessionStorage.getItem(privateKeyName);

    if (!privateKey) return null;

    return Buffer.from(privateKey, "base64").toString("utf-8");
  }

  static clear() {
    sessionStorage.removeItem(publicKeyName);
    sessionStorage.removeItem(privateKeyName);
  }
}
