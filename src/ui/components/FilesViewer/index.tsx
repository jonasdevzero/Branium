"use client";
import Image from "next/image";
import { MaterialSymbol } from "react-material-symbols";
import "./styles.css";
import { imageMimeTypes } from "../../modules/Chat/helpers";
import { useState } from "react";

interface Props {
  close(): void;
  files: File[];
  initialIndex: number;
}

export const FilesViewer: React.FC<Props> = ({
  close,
  files,
  initialIndex,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const next = () =>
    setCurrentIndex(currentIndex + 1 === files.length ? 0 : currentIndex + 1);

  const previous = () =>
    setCurrentIndex(currentIndex === 0 ? files.length - 1 : currentIndex - 1);

  const handleClose = () => {
    setCurrentIndex(0);
    close();
  };

  const renderFile = (file: File) => {
    if (!file) return;

    const isImage = imageMimeTypes.includes(file.type);
    const url = URL.createObjectURL(file);

    if (isImage) {
      return (
        <Image
          key={url}
          src={url}
          fill
          alt={file.name}
          onLoad={() => URL.revokeObjectURL(url)}
        />
      );
    }
  };

  return (
    <div className="overlay files__viewer--overlay">
      <div className="files__viewer">
        <button
          type="button"
          className="files__close icon__button"
          onClick={handleClose}
        >
          <MaterialSymbol icon="close" />
        </button>
        {files.length > 1 && (
          <button type="button" onClick={previous}>
            <MaterialSymbol icon="navigate_before" />
          </button>
        )}

        <div className="files__content">{renderFile(files[currentIndex])}</div>

        {files.length > 1 && (
          <button type="button" onClick={next}>
            <MaterialSymbol icon="navigate_next" />
          </button>
        )}
      </div>
    </div>
  );
};
