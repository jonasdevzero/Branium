import { authUserService } from './authUserService';
import { loginUserService } from './loginUserService';
import { registerUserService } from './registerUserService';

export const userService = Object.freeze({
  subscribe: registerUserService,
  login: loginUserService,
  auth: authUserService,
});
