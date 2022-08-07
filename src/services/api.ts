/* eslint-disable import/no-cycle */
import axios, { AxiosError } from 'axios';
import { setupInterceptors } from './interceptors';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL,
});

export const getApiError = (error: AxiosError) => {
  const { message } = error?.response?.data as { message: string };
  return new Error(message ?? 'Internal Server Error');
};

setupInterceptors(api);
