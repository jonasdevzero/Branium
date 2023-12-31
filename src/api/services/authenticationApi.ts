import { ENV } from "@/api/main/config/env";
import axios, { AxiosError } from "@lib/axios";
import https from "https";
import { BaseError } from "../presentation/errors";

const agent = new https.Agent({
  rejectUnauthorized: true,
  requestCert: true,
  scheduling: "fifo",
  passphrase: ENV.AUTHENTICATION_PASSPHRASE,
  cert: ENV.CERT,
  key: ENV.KEY,
  ca: ENV.CA,
});

export const authenticationApi = axios.create({
  baseURL: ENV.AUTHENTICATION_URL,
  httpsAgent: agent,
});

authenticationApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status || 500;
    const body: any = error.response?.data || {};

    const baseError = new BaseError(body.message, status, body?.meta);
    baseError.name = "[Authentication] API error";

    return Promise.reject(baseError);
  }
);
