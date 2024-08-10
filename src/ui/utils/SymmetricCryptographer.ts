"client-only";

export class SymmetricCryptographer {
  private static ALGORITHM = "AES-GCM";
  private static MAX_MIMETYPE_LENGTH = 127; // RFC 4288

  static generateKeyBlob() {
    const key = Buffer.from(
      crypto.getRandomValues(new Uint8Array(32))
    ).toString("base64");

    const iv = crypto.getRandomValues(new Uint8Array(12));

    return `${key}-${iv}` as const;
  }

  static async encrypt(plainText: string, keyBlob: string) {
    const [key, ivString] = keyBlob.split("-");
    const textEncoder = new TextEncoder();

    const iv = textEncoder.encode(ivString);
    const encodedText = textEncoder.encode(plainText);

    const secretKey = await this.importKey(key);

    const cipherText = await crypto.subtle.encrypt(
      { name: this.ALGORITHM, iv },
      secretKey,
      encodedText
    );

    return Buffer.from(cipherText).toString("base64");
  }

  static async decrypt(cipherText: string, keyBlob: string) {
    const [key, ivString] = keyBlob.split("-");

    const iv = new TextEncoder().encode(ivString);
    const secretKey = await this.importKey(key);

    const cleartext = await crypto.subtle.decrypt(
      {
        name: this.ALGORITHM,
        iv,
      },
      secretKey,
      Buffer.from(cipherText, "base64")
    );

    return new TextDecoder().decode(cleartext);
  }

  private static async importKey(key: string) {
    const keyBuffer = Buffer.from(key, "base64");

    return crypto.subtle.importKey(
      "raw",
      keyBuffer,
      { name: this.ALGORITHM, length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  }

  static async encryptFile(file: File, keyBlob: string) {
    const [key, ivString] = keyBlob.split("-");
    const textEncoder = new TextEncoder();

    const iv = textEncoder.encode(ivString);

    const [secretKey, fileBuffer] = await Promise.all([
      this.importKey(key),
      file.arrayBuffer(),
    ]);

    const data = new Uint8Array(
      this.MAX_MIMETYPE_LENGTH + fileBuffer.byteLength
    );

    data.set(textEncoder.encode(file.type));
    data.set(new Uint8Array(fileBuffer), this.MAX_MIMETYPE_LENGTH);

    const encryptedFile = await crypto.subtle.encrypt(
      { name: this.ALGORITHM, iv },
      secretKey,
      data
    );

    return new File([encryptedFile], file.name + ".enc", {
      type: "application/octet-stream",
    });
  }

  static async decryptFile(file: File, keyBlob: string) {
    const [key, ivString] = keyBlob.split("-");

    const iv = new TextEncoder().encode(ivString);

    const [secretKey, fileBuffer] = await Promise.all([
      this.importKey(key),
      file.arrayBuffer(),
    ]);

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: this.ALGORITHM,
        iv,
      },
      secretKey,
      fileBuffer
    );

    const mimeTypeBytes = new Uint8Array(
      decryptedBuffer.slice(0, this.MAX_MIMETYPE_LENGTH)
    );

    const nullByteIndex = Array.from(mimeTypeBytes).findIndex(
      (byte) => byte === 0
    );

    const sanitizedMimeTypeBytes = mimeTypeBytes.slice(
      0,
      nullByteIndex !== -1 ? nullByteIndex : undefined
    );

    const mimeType = new TextDecoder().decode(sanitizedMimeTypeBytes);
    const fileData = decryptedBuffer.slice(this.MAX_MIMETYPE_LENGTH);

    const fileName = file.name.replace(/\.enc/g, "");

    return new File([fileData], fileName, { type: mimeType });
  }
}
