import { authenticationApi } from "./authenticationApi";
import { keyExchangeApi } from "./keyExchangeApi";
import { messagesApi } from "./messagesApi";

export const services = Object.freeze({
  auth: authenticationApi,
  messages: messagesApi,
  keys: keyExchangeApi,
});
