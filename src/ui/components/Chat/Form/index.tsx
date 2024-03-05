import { MessageFileType, MessageType } from "@/domain/models";
import { useCallback, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import { Dropdown } from "../..";
import { FilesForm } from "./components";
import {
  getMessageType,
  imageMimeTypes,
  isValidImage,
  validateImages,
} from "./helpers";
import "./styles.css";

export interface CreateMessageProps {
  text?: string;
  type: MessageType;
  files: File[];
}

interface FormProps {
  onSubmit(data: CreateMessageProps): void;
}

export function Form({ onSubmit }: FormProps) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [filesType, setFilesType] = useState<MessageFileType>();

  const submit = useCallback(() => {
    const txt = text || undefined;

    onSubmit({ text: txt, files, type: getMessageType(files, txt) });

    setText("");
    setFiles([]);
    setFilesType(undefined);
  }, [files, onSubmit, text]);

  const onSelectImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;

    const images = validateImages(Array.from(e.target.files));

    if (!images) return;

    setFiles(images);
    setFilesType("IMAGE");
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const file = Array.from(e.clipboardData.files)[0];

    if (!file) return;

    if (imageMimeTypes.includes(file.type) && isValidImage(file)) {
      setFiles([file]);
      setFilesType("IMAGE");
      return;
    }
  };

  return (
    <form className="chat__form">
      <button type="button" className="button__icon">
        <MaterialSymbol icon="mood" />
      </button>

      <Dropdown
        icon={<MaterialSymbol icon="expand_less" />}
        options={[
          {
            label: "documentos",
            onClick: () => null,
            icon: <MaterialSymbol icon="text_snippet" />,
          },
          {
            label: "fotos",
            onClick: () => document.getElementById("f-images")?.click(),
            icon: <MaterialSymbol icon="photo" />,
          },
          {
            label: "vídeo",
            onClick: () => null,
            icon: <MaterialSymbol icon="videocam" />,
          },
        ]}
      />

      <input
        type="file"
        name="f-images"
        id="f-images"
        accept=".png,.jpg,.jpeg"
        onChange={onSelectImages}
        multiple
        hidden
      />

      <textarea
        name="text"
        id="message-text"
        className="text"
        placeholder="Digite uma mensagem"
        autoFocus
        contentEditable="true"
        autoComplete="false"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onPaste={handlePaste}
        onKeyDown={(e) => {
          if (e.code === "Enter" && e.shiftKey) return true;

          if (e.code === "Enter" || e.code === "NumpadEnter") {
            e.preventDefault();
            submit();
            return false;
          }
        }}
      />

      <button type="button" className="button__icon">
        <MaterialSymbol icon="mic" />
      </button>

      <FilesForm
        text={text}
        setText={setText}
        type={filesType}
        files={files}
        setFiles={setFiles}
        onSubmit={submit}
        onCancel={() => {
          setFiles([]);
          setFilesType(undefined);
        }}
      />
    </form>
  );
}
