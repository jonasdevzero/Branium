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
  updateApiAccessToken,
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
    (replaceTo = '/') => {
      setStatus('unauthenticated');
      clearAuthTokens();
      router.replace(replaceTo);
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

  useEffect(() => {
    isProtectedPage() && hasAuthTokens() && (!user.id || status === 'loading')
      ? auth()
      : null;

    isProtectedPage() && (!hasAuthTokens() || status === 'unauthenticated')
      ? router.replace('/login')
      : null;
  }, [auth, user, isProtectedPage, status, router]);

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
