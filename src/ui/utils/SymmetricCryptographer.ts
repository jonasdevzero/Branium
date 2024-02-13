"client-only";

export class SymmetricCryptographer {
  private static ALGORITHM = "AES-GCM";

  static generateKeyBlob() {
    const key = Buffer.from(
      crypto.getRandomValues(new Uint8Array(32))
    ).toString("base64");

    const iv = crypto.getRandomValues(new Uint8Array(12));

    return `${key}-${iv}` as const;
  }

  static async encrypt(plainText: string, keyBlob: string) {
    const [keyString, ivString] = keyBlob.split("-");
    const textEncoder = new TextEncoder();

    const key = Buffer.from(keyString, "base64");
    const iv = textEncoder.encode(ivString);
    const encodedText = textEncoder.encode(plainText);

    const secretKey = await crypto.subtle.importKey(
      "raw",
      key,
      { name: this.ALGORITHM, length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    const cipherText = await crypto.subtle.encrypt(
      { name: this.ALGORITHM, iv },
      secretKey,
      encodedText
    );

    return Buffer.from(cipherText).toString("binary");
  }

  static async decrypt(cipherText: string, keyBlob: string) {
    const [keyString, ivString] = keyBlob.split("-");
    const textEncoder = new TextEncoder();

    const key = Buffer.from(keyString, "base64");
    const iv = textEncoder.encode(ivString);

    const secretKey = await crypto.subtle.importKey(
      "raw",
      key,
      { name: this.ALGORITHM, length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    const cleartext = await crypto.subtle.decrypt(
      {
        name: this.ALGORITHM,
        iv,
      },
      secretKey,
      Buffer.from(cipherText, "binary")
    );

    return new TextDecoder().decode(cleartext);
  }
}
