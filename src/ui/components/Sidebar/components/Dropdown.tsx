import { MaterialSymbol } from "react-material-symbols";
import { Popover, PopoverItem } from "../..";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/ui/modules";
import { useAuth } from "@/ui/hooks";

export function SidebarDropdown() {
  const router = useRouter();
  const { logout } = useAuth();

  const dropdownOptions = useMemo<PopoverItem[]>(
    () => [
      {
        label: "convidar usuário",
        icon: <MaterialSymbol icon="person_add" size={24} />,
        onClick: () => router.push("/invites"),
      },
      {
        label: "novo grupo",
        icon: <MaterialSymbol icon="group_add" size={24} />,
        onClick: () =>
          toast.info("Em breve estará disponível!", { id: "soon-available" }),
      },
      {
        label: "editar conta",
        icon: <MaterialSymbol icon="edit" size={24} />,
        onClick: () => null,
      },
      {
        label: "sair",
        icon: <MaterialSymbol icon="logout" size={24} />,
        onClick: logout,
      },
    ],
    [logout, router]
  );

  return (
    <Popover
      options={dropdownOptions}
      position={{ horizontalAxis: ["left"], verticalAxis: ["bottom"] }}
    />
  );
}
