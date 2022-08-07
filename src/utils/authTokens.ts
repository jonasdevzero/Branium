import { api } from '@/services/api';
import { destroyCookie, parseCookies, setCookie } from 'nookies';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const accessTokenName = '@Branium:AccessToken';
const refreshTokenName = '@Branium:RefreshToken';

export const setAuthTokens = (tokens: AuthTokens) => {
  const { accessToken, refreshToken } = tokens;

  setCookie(null, accessTokenName, accessToken, {
    path: '/',
  });
  setCookie(null, refreshTokenName, refreshToken, {
    path: '/',
  });

  api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
};

export const clearAuthTokens = () => {
  destroyCookie(null, accessTokenName);
  destroyCookie(null, refreshTokenName);
};

export const getAccessToken = () => {
  const { [accessTokenName]: accessToken } = parseCookies(null);
  return accessToken;
};

export const getRefreshToken = () => {
  const { [refreshTokenName]: refreshToken } = parseCookies(null);
  return refreshToken;
};

export const hasAuthTokens = () => {
  return !!getAccessToken() && !!getRefreshToken();
};
