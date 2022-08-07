import { AuthTokens } from '@/utils/authTokens';
import { AxiosError } from 'axios';
import { api, getApiError } from '../api';

interface SubscribeUser {
  username: string;
  password: string;
}

async function registerUserService(data: SubscribeUser) {
  try {
    const response = await api.post<AuthTokens>('/user', data);
    return response.data;
  } catch (error) {
    throw getApiError(error as AxiosError);
  }
}

export { registerUserService };
