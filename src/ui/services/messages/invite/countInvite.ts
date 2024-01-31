import { toast } from "@/ui/modules";

export async function countInvite(): Promise<number> {
  const response = await fetch(`/api/invite/count`);

  if (response.status === 500) {
    toast.error(
      "Parece que houve algum problema ao procurar por novos convites!",
      {
        id: "server-error",
      }
    );
  }

  const result = await response.json();

  if (!response.ok) throw await result;
  return result;
}
