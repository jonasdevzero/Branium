import { User } from '@/@types/user';

export const authUserService = async () => {
  return { id: '123456789', username: 'devzero' } as User;
};
