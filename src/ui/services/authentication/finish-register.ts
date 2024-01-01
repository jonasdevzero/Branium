import { FinishUserRegisterDTO } from "@/domain/dtos";
import { toast } from "@/ui/modules";

export async function finishRegister(data: FinishUserRegisterDTO) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => formData.append(key, value));

  const response = await fetch("/api/register/finish", {
    method: "POST",
    body: formData,
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
