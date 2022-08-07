import { AuthTokens } from '@/utils/authTokens';
import { AxiosError } from 'axios';
import { api, getApiError } from '../api';

export interface LoginUser {
  username: string;
  password: string;
}

async function loginUserService(data: LoginUser) {
  try {
    const response = await api.post<AuthTokens>('/user/login', data);
    return response.data;
  } catch (error) {
    throw getApiError(error as AxiosError);
  }
}

export { loginUserService };
