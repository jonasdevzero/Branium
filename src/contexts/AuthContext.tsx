import { useRouter } from 'next/router';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  clearAuthTokens,
  getAccessToken,
  hasAuthTokens,
  setAuthTokens,
  updateApiAccessToken,
} from '@/utils/authTokens';
import { User } from '@/@types/user';
import { userService } from '@/services/userService';
import { LoginUser } from '@/services/userService/loginUserService';
import { LoadingContainer } from '@/components/LoadingContainer';
import { socket } from '@/services/socket';

interface AuthProviderProps {
  children: React.ReactNode;
}

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';
type SocketStatus = 'connecting' | 'connected' | 'disconnected';

interface IAuthContext {
  status: AuthStatus;
  user: User;
  signIn(data: LoginUser): Promise<void>;
  signOut(replacePath?: string): void;
}

const protectedPath = '/branium';

export const AuthContext = createContext({} as IAuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User>({} as User);

  const [socketStatus, setSocketStatus] =
    useState<SocketStatus>('disconnected');

  const router = useRouter();

  const isProtectedPage = useCallback(() => {
    return router.asPath.startsWith(protectedPath);
  }, [router]);

  const signIn = useCallback(async (data: LoginUser) => {
    const tokens = await userService.login(data);

    setAuthTokens(tokens);
    setStatus('authenticated');
  }, []);

  const signOut = useCallback(
    (redirectTo = '/') => {
      socket.disconnect();
      router.push(redirectTo).then(() => {
        setStatus('unauthenticated');
        clearAuthTokens();
        setUser({} as User);
      });
    },
    [router],
  );

  const auth = useCallback(async () => {
    updateApiAccessToken();

    try {
      const authUser = await userService.auth();

      setUser(authUser);
      setStatus('authenticated');
    } catch (error) {
      signOut('/login');
    }
  }, [signOut]);

  const connectSocket = useCallback(() => {
    socket.on('connect', () => setSocketStatus('connected'));

    socket.on('disconnect', (reason) => {
      socket.close();
      if (reason === 'transport close') setTimeout(connectSocket, 3000);
    });

    socket.on('disconnect:token-expired', async () => {
      try {
        await userService.refresh();
        connectSocket();
      } catch (error) {
        signOut();
      }
    });

    if (socketStatus === 'connecting' || socket.active) return;

    setSocketStatus('connecting');
    socket.auth = { token: getAccessToken() };
    socket.connect();
  }, [signOut, socketStatus]);

  useEffect(() => {
    if (isProtectedPage()) {
      hasAuthTokens() && (!user.id || status === 'loading') ? auth() : null;

      !hasAuthTokens() || status === 'unauthenticated'
        ? router.replace('/login')
        : null;
    }
  }, [auth, user, isProtectedPage, status, router]);

  useEffect(() => {
    isProtectedPage() && status === 'authenticated' ? connectSocket() : null;

    return () => {
      socket.removeListener('connect');
      socket.removeListener('disconnect');
      socket.removeListener('disconnect:token-expired');
    };
  }, [connectSocket, isProtectedPage, status]);

  const context = useMemo(
    () => ({ status, user, signIn, signOut }),
    [status, user, signIn, signOut],
  );

  return (
    <AuthContext.Provider value={context}>
      {isProtectedPage() && (!user.id || status === 'loading') ? (
        <LoadingContainer />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
