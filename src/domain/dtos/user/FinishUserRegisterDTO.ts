export interface FinishUserRegisterDTO {
  email: string;
  token: string;

  name: string;
  image?: File;
}
