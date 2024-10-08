"client-only";

export class AsymmetricCryptographer {
  private static ALGORITHM = {
    name: "RSA-OAEP",
    hash: { name: "SHA-256" },
  };

  static async encrypt(plainText: string, publicKey: string) {
    const key = await crypto.subtle.importKey(
      "spki",
      this.getPemPublicKeyContent(publicKey),
      this.ALGORITHM,
      true,
      ["encrypt"]
    );

    const encrypted = await crypto.subtle.encrypt(
      { name: this.ALGORITHM.name },
      key,
      new TextEncoder().encode(plainText)
    );

    return Buffer.from(encrypted).toString("base64");
  }

  static async decrypt(cipherText: string, privateKey: string) {
    const key = await crypto.subtle.importKey(
      "pkcs8",
      this.getPemPrivateKeyContent(privateKey),
      this.ALGORITHM,
      true,
      ["decrypt"]
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: this.ALGORITHM.name },
      key,
      Buffer.from(cipherText, "base64")
    );

    return new TextDecoder().decode(decrypted);
  }

  private static getPemPublicKeyContent(publicKey: string) {
    const pemContents = publicKey
      .replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----/g, "")
      .replace(/\\n/g, "");

    const binaryDerString = Buffer.from(pemContents, "base64").toString(
      "binary"
    );

    const binaryDer = this.parseBinaryToArrayBuffer(binaryDerString);

    return binaryDer;
  }

  private static getPemPrivateKeyContent(privateKey: string) {
    const pemContents = privateKey
      .replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----/g, "")
      .replace(/\\n/g, "");

    const binaryDerString = Buffer.from(pemContents, "base64").toString(
      "binary"
    );
    const binaryDer = this.parseBinaryToArrayBuffer(binaryDerString);

    return binaryDer;
  }

  private static parseBinaryToArrayBuffer(str: string) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);

    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }

    return buf;
  }
}
