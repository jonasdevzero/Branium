import { LoginUserDTO } from "@/domain/dtos";
import { toast } from "@/ui/modules";
import { KeyPairStorage } from "@/ui/utils";

export async function login(data: LoginUserDTO) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.status === 500) {
    toast.error(
      "Parece que houve algum problema, tente novamente em instantes!",
      {
        id: "server-error",
      }
    );
  }

  const result = await response.json();

  if (!response.ok) throw result;

  KeyPairStorage.set(result);
}
