// eslint-disable-next-line import/no-cycle
import { api } from '@/services/api';
import { destroyCookie, parseCookies, setCookie } from 'nookies';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const accessTokenName = '@Branium:AccessToken';
const refreshTokenName = '@Branium:RefreshToken';

export const getAccessToken = () => {
  const { [accessTokenName]: accessToken } = parseCookies(null);
  return accessToken;
};

export const getRefreshToken = () => {
  const { [refreshTokenName]: refreshToken } = parseCookies(null);
  return refreshToken;
};

export const updateApiAccessToken = () => {
  const accessToken = getAccessToken();
  api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
};

export const hasAuthTokens = () => {
  return !!getAccessToken() && !!getRefreshToken();
};

export const setAuthTokens = (tokens: AuthTokens) => {
  const { accessToken, refreshToken } = tokens;

  const expires = new Date();
  expires.setDate(new Date().getDate() + 30);

  setCookie(null, accessTokenName, accessToken, {
    path: '/',
    expires,
  });
  setCookie(null, refreshTokenName, refreshToken, {
    path: '/',
    expires,
  });

  updateApiAccessToken();
};

export const clearAuthTokens = () => {
  destroyCookie(null, accessTokenName);
  destroyCookie(null, refreshTokenName);

  api.defaults.headers.common.Authorization = '';
};
