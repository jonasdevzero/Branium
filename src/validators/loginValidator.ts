import { Yup } from './yup';

export const loginValidator = Yup.object().shape({
  username: Yup.string().required('username is required'),
  password: Yup.string().required('password is required'),
});
