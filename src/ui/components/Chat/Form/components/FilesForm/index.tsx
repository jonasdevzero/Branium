import { MessageFileType } from "@/domain/models";
import "./styles.css";
import { useCallback, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import Image from "next/image";
import { FilesIndicators } from "..";

interface Props {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;

  type?: MessageFileType;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;

  onSubmit(): void;
  onCancel(): void;
}

export function FilesForm({
  text,
  setText,
  type,
  files,
  setFiles,
  onSubmit,
  onCancel,
}: Props) {
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
    onCancel();
  }, [onCancel]);

  const submit = useCallback(() => {
    setCurrentIndex(0);
    onSubmit();
  }, [onSubmit]);

  const renderImage = useCallback(() => {
    if (type !== "IMAGE") return;

    const image = files[currentIndex];

    if (!image) return;

    const url = URL.createObjectURL(image);

    return (
      <Image
        key={image.lastModified}
        src={url}
        alt={image.name}
        fill
        onLoadedData={() => URL.revokeObjectURL(url)}
      />
    );
  }, [currentIndex, files, type]);

  if (typeof type === "undefined" || !files.length) return;

  return (
    <div className="overlay">
      <div className="files__form">
        <div className="files__container">
          <button type="button" onClick={previous}>
            <MaterialSymbol icon="navigate_before" />
          </button>

          <div className="files__content">{renderImage()}</div>

          <button type="button" onClick={next}>
            <MaterialSymbol icon="navigate_next" />
          </button>
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
            id="message-text"
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
