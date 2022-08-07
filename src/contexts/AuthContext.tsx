import { useRouter } from 'next/router';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { User } from '@/@types/user';
import { userService } from '@/services/userService';
import { LoginUser } from '@/services/userService/loginUserService';
import {
  clearAuthTokens,
  hasAuthTokens,
  setAuthTokens,
} from '@/utils/authTokens';
import { LoadingContainer } from '@/components/LoadingContainer';

interface AuthProviderProps {
  children: React.ReactNode;
}

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

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
    (replacePath = '/') => {
      setStatus('unauthenticated');
      clearAuthTokens();
      router.replace(replacePath);
    },
    [router],
  );

  const auth = useCallback(async () => {
    try {
      const authUser = await userService.auth();

      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      setUser(authUser);
      setStatus('authenticated');
    } catch (error) {
      signOut('/login');
    }
  }, [signOut, setUser, setStatus]);

  useEffect(() => {
    isProtectedPage() && hasAuthTokens() && !user.id ? auth() : null;
  }, [auth, user, isProtectedPage]);

  useEffect(() => {
    isProtectedPage() && !hasAuthTokens() ? router.replace('/login') : null;

    isProtectedPage() && status === 'unauthenticated'
      ? router.push('/login')
      : null;
  }, [router, status, isProtectedPage]);

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
