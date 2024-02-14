"use client";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { KeyPairStorage } from "../utils";
import { keysService } from "../services";
import { Form, Modal } from "../components";
import { ApiError, KeyPair } from "@/domain/models";
import { useAuth } from "../hooks";
import { usePathname, useRouter } from "next/navigation";

interface UserKey {
  userId: string;
  publicKey: string;
}

interface CryptoKeysProps {
  publicKey: string | null;
  privateKey: string | null;
  hasKeyPair(): boolean;
  loadPublicKey(userId: string): Promise<string | null>;
  requirePassword(): void;
}

export const CryptoKeysContext = createContext({} as CryptoKeysProps);

export function CryptoKeysProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [keys, setKeys] = useState<UserKey[]>([]);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setPublicKey(KeyPairStorage.getPublic());
    setPrivateKey(KeyPairStorage.getPrivate());
  }, []);

  useEffect(() => {
    if (pathname === "/channels") setIsOpen(false);
  }, [pathname]);

  const requirePassword = useCallback(() => {
    if ((!!publicKey && !!privateKey) || isOpen) return;
    setIsOpen(true);
  }, [isOpen, privateKey, publicKey]);

  const loadPublicKey = useCallback(
    async (userId: string) => {
      const key = keys.find((k) => k.userId === userId);
      if (key) return key.publicKey;

      const publicKey = await keysService.findPublicKey(userId);

      if (publicKey !== null) setKeys((k) => [...k, { userId, publicKey }]);

      return publicKey;
    },
    [keys]
  );

  const hasKeyPair = useCallback(() => {
    return !!KeyPairStorage.getPublic() && !!KeyPairStorage.getPrivate();
  }, []);

  const value = useMemo(
    () => ({
      publicKey,
      privateKey,
      loadPublicKey,
      requirePassword,
      hasKeyPair,
    }),
    [publicKey, privateKey, loadPublicKey, requirePassword, hasKeyPair]
  );

  return (
    <CryptoKeysContext.Provider value={value}>
      <FetchKeyPairModal
        isOpen={isOpen}
        onSuccess={(keyPair) => {
          setPublicKey(keyPair.publicKey);
          setPrivateKey(keyPair.privateKey);
          setIsOpen(false);
        }}
        onCancel={() => router.replace("/channels")}
      />
      {children}
    </CryptoKeysContext.Provider>
  );
}

function FetchKeyPairModal({
  isOpen,
  onSuccess,
  onCancel,
}: {
  isOpen: boolean;
  onSuccess(keyPair: KeyPair): void;
  onCancel(): void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [tries, setTries] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { logout } = useAuth();

  const reset = useCallback(() => {
    setPassword("");
    setError(undefined);
    setTries(0);
    setIsLoading(false);
  }, []);

  const confirm = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(undefined);
    setTries(tries + 1);

    try {
      const keyPair = await keysService.loadKeyPair(password);
      onSuccess(keyPair);
      reset();
    } catch (error) {
      const err = error as ApiError;

      if (err.statusCode !== 401) return;

      if (tries === 4) return logout();

      setError("Senha inválida");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, logout, onSuccess, password, reset, tries]);

  const cancel = useCallback(() => {
    reset();
    onCancel();
  }, [onCancel, reset]);

  return (
    <Modal title="Desbloquear mensagens" isOpen={isOpen}>
      <Form.Input
        field="senha"
        type="password"
        name="k-password"
        id="k-password"
        placeholder="Digite a sua senha..."
        autoFocus
        value={password}
        disabled={isLoading}
        onChange={(e) => {
          setError(undefined);
          setPassword(e.target.value);
        }}
        error={error}
        subInfo={tries > 1 ? `tentativas ${tries}/5` : undefined}
      />

      <div className="modal__actions">
        <button type="button" onClick={cancel}>
          cancelar
        </button>

        <button type="button" onClick={confirm} disabled={isLoading}>
          confirmar
        </button>
      </div>
    </Modal>
  );
}
