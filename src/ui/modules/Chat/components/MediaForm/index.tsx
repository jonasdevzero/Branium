import { MessageFileType } from "@/domain/models";
import "./styles.css";
import { useCallback, useMemo, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import Image from "next/image";
import { FilesIndicators } from "./components";

interface Props {
  text: string;
  files: File[];
  type?: MessageFileType;

  onSubmit(): void;
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
    setCurrentIndex(0);
    onSubmit();
  }, [onSubmit]);

  const currentImage = useMemo(() => {
    if (type !== "IMAGE") return;

    const image = files[currentIndex];

    if (!image) return;

    const url = URL.createObjectURL(image);

    return (
      <Image
        src={url}
        alt={image.name}
        fill
        onLoadedData={() => URL.revokeObjectURL(url)}
      />
    );
  }, [currentIndex, files, type]);

  const currentVideo = useMemo(() => {
    if (type !== "VIDEO") return;

    const video = files[0];

    if (!video) return;

    const url = URL.createObjectURL(video);

    return <video src={url} controls onLoad={() => URL.revokeObjectURL(url)} />;
  }, [files, type]);

  return (
    <div className="overlay">
      <div className="files__form">
        <div className="files__container">
          {files.length > 1 && (
            <button type="button" onClick={previous}>
              <MaterialSymbol icon="navigate_before" />
            </button>
          )}

          <div className="files__content">
            {currentImage}
            {currentVideo}
          </div>

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
