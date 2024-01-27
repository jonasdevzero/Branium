import { toast } from "@/ui/modules";

interface CreateInviteDTO {
  receiverId: string;
  message?: string;
}

export async function createInvite(data: CreateInviteDTO) {
  const response = await fetch(`/api/invite`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
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
  return;
}
