import { LoginUserDTO } from "@/domain/dtos";
import { toast } from "@/ui/modules";

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

  if (!response.ok) throw await response.json();
}
