import { RegisterUserDTO } from "@/domain/dtos";
import { toast } from "@/ui/modules";

export async function registerUser(data: RegisterUserDTO) {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
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
