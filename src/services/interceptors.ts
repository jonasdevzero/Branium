/* eslint-disable import/no-cycle */
import {
  AuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from '@/utils/authTokens';
import { AxiosError, AxiosInstance } from 'axios';

export const setupInterceptors = (api: AxiosInstance) => {
  const refreshToken = async () => {
    const token = getRefreshToken();

    if (!token) {
      throw new Error('Unauthenticated!');
    }

    const response = await api.post<AuthTokens>('/user/refresh-token', {
      token,
    });

    setAuthTokens(response.data);
  };

  const onResponseError = async (error: AxiosError): Promise<unknown> => {
    if (error.response?.status === 401) {
      await refreshToken();

      if (error.config.headers) {
        // eslint-disable-next-line no-param-reassign
        error.config.headers.Authorization = `Bearer ${getAccessToken()}`;
      }

      return api(error.config);
    }

    return Promise.reject(error);
  };

  api.interceptors.response.use((res) => res, onResponseError);
};
