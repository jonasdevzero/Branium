import { MessageFileType } from "@/domain/models";
import "./styles.css";
import { useCallback, useState } from "react";
import {
  getMessageType,
  isImage,
  isValidVideo,
  isVideo,
  validateImages,
  MediaForm,
} from "@/ui/modules/Chat";
import { MaterialSymbol } from "react-material-symbols";
import { Dropdown } from "@/ui/components";
import { SubmitMessageDTO } from "@/domain/dtos";

interface FormProps {
  onSubmit(data: SubmitMessageDTO): void;
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

    const images = files.filter(isImage);
    const video = files.find(isVideo);

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
        <MediaForm
          text={text}
          files={files}
          type={filesType}
          onSubmit={submit}
          onCancel={() => setFilesType(undefined)}
        />
      )}
    </form>
  );
}
