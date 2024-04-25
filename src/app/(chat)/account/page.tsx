"use client";
import {
  Avatar,
  Form,
  NavigationHeader,
  Popover,
  PopoverItem,
} from "@/ui/components";
import { useAuth } from "@/ui/hooks";
import { toast } from "@/ui/modules";
import { messagesService } from "@/ui/services";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import "./styles.css";

const validMimeTypes = ["image/png", "image/jpg", "image/jpeg"];
const maxImageSize = 4 * 1000 * 1000; // 4MB

export default function AccountPage() {
  const { user, edit } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user.name);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (name.trim().length === 0) return;

      if (isLoading) return;
      setIsLoading(true);

      try {
        await messagesService.profile.edit({ name });
        edit({ name });

        toast.success("Perfil atualizado com sucesso");
      } catch (error) {
        toast.error("Não foi possível atualizar o perfil!", {
          id: "edit-profile",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [edit, isLoading, name]
  );

  const changePhoto = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const file = (e.target.files || [])[0];

      if (!file) return;

      if (!validMimeTypes.includes(file.type)) {
        toast.error("Formato de imagem inválida!", { id: "change-photo" });
        return;
      }

      if (file.size > maxImageSize) {
        toast.error("Tamanho máximo ultrapassado, máximo: 4MB!", {
          id: "change-photo",
        });
        return;
      }

      try {
        await messagesService.profile.edit({ image: file });
        edit({ image: file });
      } catch (error) {
        toast.error("Não foi possível alterar a sua foto", {
          id: "change-photo",
        });
      }
    },
    [edit]
  );

  const removePhoto = useCallback(async () => {
    try {
      await messagesService.profile.edit({ image: null });
      edit({ image: null });

      toast.success("Foto removida com sucesso!", { id: "remove-image" });
    } catch (error) {
      toast.error("Não foi possível remover a sua foto!", {
        id: "remove-image",
      });
    }
  }, [edit]);

  const uploadOptions = useMemo(() => {
    const options = [
      {
        label: "trocar foto",
        icon: <MaterialSymbol icon="upload" />,
        onClick: () => document.getElementById("upload-avatar")?.click(),
      },
    ] as PopoverItem[];

    if (user.image) {
      options.push({
        label: "remover foto",
        icon: <MaterialSymbol icon="delete" />,
        onClick: removePhoto,
      });
    }

    return options;
  }, [removePhoto, user.image]);

  return (
    <div className="container account__container">
      <NavigationHeader
        title="CONTA"
        links={[{ label: "perfil", href: "/account" }]}
        onClose={() => router.push("/channels")}
      />

      <div className="avatar__upload">
        <Avatar
          name={user.name}
          url={user.image}
          alt={`foto de ${user.name}`}
        />

        <input
          id="upload-avatar"
          hidden
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={changePhoto}
        />

        <Popover
          icon={<MaterialSymbol icon="edit" />}
          options={uploadOptions}
          position={{
            horizontalAxis: ["right", "left"],
            verticalAxis: ["bottom", "top"],
          }}
        />
      </div>

      <form onSubmit={onSubmit}>
        <Form.Input
          field="nome"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button type="submit" disabled={name === user.name || isLoading}>
          atualizar
        </button>
      </form>
    </div>
  );
}
