import { MessageFileType } from "@/domain/models";
import "./styles.css";
import { useCallback, useMemo, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import Image from "next/image";
import { FilesIndicators } from "./components";
import {
  AudioPlayer,
  Document,
  VideoPlayer,
  getMessageType,
} from "@/ui/modules/Chat";
import { SubmitMessageDTO } from "@/domain/dtos";

interface Props {
  text: string;
  files: File[];
  type?: MessageFileType;

  onSubmit(data: SubmitMessageDTO): void;
  onCancel(): void;
}

export function MediaForm({
  text: initialText,
  files: initialFiles,
  type,
  onSubmit,
  onCancel,
}: Props) {
  const [text, setText] = useState(initialText);
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () =>
    setCurrentIndex(currentIndex + 1 === files.length ? 0 : currentIndex + 1);

  const previous = () =>
    setCurrentIndex(currentIndex === 0 ? files.length - 1 : currentIndex - 1);

  const removeFile = useCallback(
    (index: number) => {
      if (files.length === 1) {
        onCancel();
        return;
      }

      const nextIndex = index === 0 ? 0 : index - 1;

      setCurrentIndex(nextIndex);
      setFiles((f) => f.filter((_, i) => i !== index));
    },
    [files.length, onCancel, setFiles]
  );

  const cancel = useCallback(() => {
    setCurrentIndex(0);
    setFiles([]);
    setText("");

    onCancel();
  }, [onCancel, setFiles, setText]);

  const submit = useCallback(() => {
    const txt = text || undefined;

    onSubmit({ text: txt, files, type: getMessageType(files, txt) });

    setCurrentIndex(0);
    setText("");
    setFiles([]);
  }, [files, onSubmit, text]);

  const currentFile = useMemo(() => {
    const file = files[currentIndex];
    if (!file) return;

    if (type === "FILE") return <Document file={file} />;

    if (type === "VIDEO") return <VideoPlayer src={file} />;

    if (type === "AUDIO") return <AudioPlayer src={file} />;

    const url = URL.createObjectURL(file);

    return (
      <Image
        src={url}
        alt={file.name}
        fill
        onLoadedData={() => URL.revokeObjectURL(url)}
      />
    );
  }, [currentIndex, files, type]);

  return (
    <div className="overlay">
      <div className="files__form">
        <div className="files__container">
          {files.length > 1 && (
            <button type="button" onClick={previous}>
              <MaterialSymbol icon="navigate_before" />
            </button>
          )}

          <div className="files__content">{currentFile}</div>

          {files.length > 1 && (
            <button type="button" onClick={next}>
              <MaterialSymbol icon="navigate_next" />
            </button>
          )}
        </div>

        <FilesIndicators
          currentIndex={currentIndex}
          indicators={files.map((file) => ({
            file,
            onSelect: setCurrentIndex,
            onRemove: removeFile,
          }))}
        />

        <div className="chat__form">
          <button type="button" className="button__icon">
            <MaterialSymbol icon="mood" />
          </button>

          <textarea
            name="text"
            id="message-text-file"
            className="text"
            placeholder="Digite uma mensagem (opcional)"
            autoFocus
            contentEditable="true"
            autoComplete="false"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.code === "Enter" && e.shiftKey) return true;

              if (e.code === "Enter" || e.code === "NumpadEnter") {
                e.preventDefault();
                submit();
                return false;
              }
            }}
          />

          <button
            type="button"
            className="button__icon"
            title="cancelar"
            onClick={cancel}
          >
            <MaterialSymbol icon="close" />
          </button>
        </div>
      </div>
    </div>
  );
}
