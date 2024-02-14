import {
  FinishUserRegisterDTO,
  LoginUserDTO,
  RegisterUserDTO,
} from "@/domain/dtos";
import { KeyPair } from "@/domain/models";
import { Fetch, KeyPairStorage } from "@/ui/utils";

export const authServices = {
  async registerUser(data: RegisterUserDTO) {
    await Fetch.post("/api/register", data);
  },

  async finishRegister(data: FinishUserRegisterDTO) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    await Fetch.post("/api/register/finish", formData);
  },

  async login(data: LoginUserDTO) {
    const keyPair = await Fetch.post<KeyPair>("/api/login", data);

    KeyPairStorage.set(keyPair);
  },
};
