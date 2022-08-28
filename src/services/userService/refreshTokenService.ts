import { AuthTokens, getRefreshToken, setAuthTokens } from '@/utils/authTokens';
import { api } from '../api';

export const refreshTokenService = async () => {
  const token = getRefreshToken();

  if (!token) {
    throw new Error('Unauthenticated!');
  }

  const response = await api.post<AuthTokens>('/user/refresh-token', {
    token,
  });

  setAuthTokens(response.data);
};
