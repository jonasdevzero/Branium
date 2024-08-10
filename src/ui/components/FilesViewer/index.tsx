"use client";
import Image from "next/image";
import { useState } from "react";
import { Button } from "..";
import { imageMimeTypes } from "../../modules/Chat/helpers";
import "./styles.css";

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
        <Button.Icon
          icon="close"
          className="files__close"
          onClick={handleClose}
        />

        {files.length > 1 && (
          <Button.Icon icon="navigate_before" onClick={previous} />
        )}

        <div className="files__content">{renderFile(files[currentIndex])}</div>

        {files.length > 1 && (
          <Button.Icon icon="navigate_next" onClick={next} />
        )}
      </div>
    </div>
  );
};
