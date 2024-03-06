import { MessageFileType, MessageType } from "@/domain/models";
import { useCallback, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import { Dropdown } from "../..";
import { FilesForm } from "./components";
import {
  getMessageType,
  imageMimeTypes,
  isValidImage,
  isValidVideo,
  validateImages,
  videoMimeTypes,
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

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;

    const images = validateImages(Array.from(e.target.files));

    if (!images) return;

    setFiles(images);
    setFilesType("IMAGE");
  };

  const handleVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;

    const video = Array.from(e.target.files)[0];

    if (!isValidVideo(video)) return;

    setFiles([video]);
    setFilesType("VIDEO");
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const files = Array.from(e.clipboardData.files);

    if (!files.length) return;

    const images = files.filter((f) => imageMimeTypes.includes(f.type));
    const video = files.find((f) => videoMimeTypes.includes(f.type));

    if (images.length && validateImages(images)) {
      setFiles(images);
      setFilesType("IMAGE");
      return;
    }

    if (!!video && isValidVideo(video)) {
      setFiles([video]);
      setFilesType("VIDEO");
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
            onClick: () => document.getElementById("f-video")?.click(),
            icon: <MaterialSymbol icon="videocam" />,
          },
        ]}
      />

      <input
        type="file"
        name="f-images"
        id="f-images"
        accept=".png,.jpg,.jpeg"
        onChange={handleImages}
        multiple
        hidden
      />

      <input
        type="file"
        name="f-video"
        id="f-video"
        accept=".mp4"
        onChange={handleVideo}
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

      {files.length > 0 && typeof filesType !== "undefined" && (
        <FilesForm
          text={text}
          setText={setText}
          type={filesType}
          files={files}
          setFiles={setFiles}
          onSubmit={submit}
          onCancel={() => setFilesType(undefined)}
        />
      )}
    </form>
  );
}
