import { authUserService } from './authUserService';
import { loginUserService } from './loginUserService';
import { refreshTokenService } from './refreshTokenService';
import { registerUserService } from './registerUserService';

export const userService = Object.freeze({
  subscribe: registerUserService,
  login: loginUserService,
  auth: authUserService,
  refresh: refreshTokenService,
});
