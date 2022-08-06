import { Yup } from './yup';

export const subscribeValidator = Yup.object().shape({
  username: Yup.string().required('username is required'),
  password: Yup.string()
    .required('password is required')
    .min(6, 'Minimum 6 characters'),
});
