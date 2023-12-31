export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 16;

export const invalidPasswordMessage =
  "No mínimo um número, letra e carácter especial";

// Allow only a-z A-Z ç-Ç !@#$&* 0-9
export const isValidPassword = (password: string) =>
  /^(?=.*[a-zA-ZçÇ])(?=.*[!@#$&*])(?=.*[0-9])[a-zA-ZçÇ!@#$&*0-9]+$/g.test(
    password
  );
