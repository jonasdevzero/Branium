import { Button } from "@/ui/components";
import { isDocument, isImage } from "@/ui/modules/Chat";
import Image from "next/image";
import { useCallback } from "react";
import "./styles.css";

interface FileIndicator {
  file: File;
  onSelect(index: number): void;
  onRemove(index: number): void;
}

interface Props {
  currentIndex: number;
  indicators: FileIndicator[];
}

export function FilesIndicators({ currentIndex, indicators }: Props) {
  const renderFile = useCallback(
    (indicator: FileIndicator, index: number) => {
      const { file, onSelect, onRemove } = indicator;

      const isActive = index === currentIndex ? "file__indicator--active" : "";

      if (isImage(file)) {
        const url = URL.createObjectURL(file);

        return (
          <div
            className={`file__indicator ${isActive}`}
            key={file.lastModified}
          >
            <Image
              src={url}
              alt={file.name}
              width={56}
              height={56}
              onLoadedData={() => URL.revokeObjectURL(url)}
              onClick={() => onSelect(index)}
            />

            <Button.Icon
              icon="close"
              className="remove__file"
              onClick={() => onRemove(index)}
            />
          </div>
        );
      }

      if (isDocument(file)) {
        const ext = file.name.split(".").slice(-1)[0];

        return (
          <div
            className={`file__indicator ${isActive}`}
            key={file.lastModified}
          >
            <span className="document__name" onClick={() => onSelect(index)}>
              .{ext}
            </span>

            <Button.Icon
              icon="close"
              className="remove__file"
              onClick={() => onRemove(index)}
            />
          </div>
        );
      }
    },
    [currentIndex]
  );

  return <div className="files__indicators">{indicators.map(renderFile)}</div>;
}
