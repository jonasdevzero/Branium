import Image from "next/image";
import { useCallback } from "react";
import { MaterialSymbol } from "react-material-symbols";
import { isImage } from "@/ui/modules/Chat";
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

            <button
              className="remove__file button__icon"
              type="button"
              onClick={() => onRemove(index)}
            >
              <MaterialSymbol icon="close" />
            </button>
          </div>
        );
      }
    },
    [currentIndex]
  );

  return <div className="files__indicators">{indicators.map(renderFile)}</div>;
}
