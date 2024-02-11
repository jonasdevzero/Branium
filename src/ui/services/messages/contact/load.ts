import { Contact } from "@/domain/models";
import { toast } from "@/ui/modules";

export async function loadContact(id: string): Promise<Contact> {
  const response = await fetch(`/api/contact/${id}`);

  if (response.status === 500) {
    toast.error(
      "Parece que houve algum problema, tente novamente em instantes!",
      {
        id: "server-error",
      }
    );
  }

  const result = await response.json();

  if (!response.ok) throw await result;
  return result;
}
