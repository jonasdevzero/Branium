import { User } from '@/@types/user';
import { api } from '../api';

export const authUserService = async () => {
  const response = await api.post<User>('/user/auth');
  return response.data;
};
