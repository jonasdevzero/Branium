import { toast } from "@/ui/modules";

interface ResponseInviteDTO {
  inviteId: string;
  accept: boolean;
}

export async function responseInvite(data: ResponseInviteDTO) {
  const response = await fetch(`/api/invite/response`, {
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
}
