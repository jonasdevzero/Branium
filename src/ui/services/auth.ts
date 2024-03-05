import {
  FinishUserRegisterDTO,
  LoginUserDTO,
  RegisterUserDTO,
} from "@/domain/dtos";
import { KeyPair } from "@/domain/models";
import { Fetch, KeyPairStorage } from "@/ui/utils";
import { createNestedFormData } from "../helpers";

export const authServices = Object.freeze({
  async registerUser(data: RegisterUserDTO) {
    await Fetch.post("/api/register", data);
  },

  async finishRegister(data: FinishUserRegisterDTO) {
    const formData = createNestedFormData(data);

    await Fetch.post("/api/register/finish", formData);
  },

  async login(data: LoginUserDTO) {
    const keyPair = await Fetch.post<KeyPair>("/api/login", data);

    KeyPairStorage.set(keyPair);
  },
});
