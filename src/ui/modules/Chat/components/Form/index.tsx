import { SubmitMessageDTO } from "@/domain/dtos";
import { Message, MessageFileType } from "@/domain/models";
import { Button, Popover } from "@/ui/components";
import {
  AudioRecorder,
  EmojiPicker,
  MediaForm,
  getMessageType,
  isDocument,
  isImage,
  isValidVideo,
  isVideo,
  validateDocuments,
  validateImages,
} from "@/ui/modules/Chat";
import { useCallback, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import "./styles.css";
import { useMessages } from "@/ui/hooks";
import { EditForm } from "./components";

interface FormProps {
  onSubmit(data: SubmitMessageDTO): void;
  youBlocked?: boolean;
  blocked?: boolean;
}

export function Form({ onSubmit, youBlocked, blocked }: FormProps) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [filesType, setFilesType] = useState<MessageFileType>();
  const [recordAudio, setRecordAudio] = useState(false);

  const { selectedMessage, selectMessage } = useMessages();

  const clear = useCallback(() => {
    setText("");
    setFiles([]);
    setFilesType(undefined);

    selectMessage(null);
  }, [selectMessage]);

  const submit = useCallback(() => {
    const txt = text || undefined;
    let reply: Message | undefined;

    if (selectedMessage && selectedMessage.type === "REPLY") {
      reply = selectedMessage.data;
    }

    onSubmit({ text: txt, files, type: getMessageType(files, txt), reply });
    clear();
  }, [clear, files, onSubmit, selectedMessage, text]);

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

  const handleDocuments = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;

    const documents = validateDocuments(Array.from(e.target.files));

    if (!documents) return;

    setFiles(documents);
    setFilesType("FILE");
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const files = Array.from(e.clipboardData.files);

    if (!files.length) return;

    const images = files.filter(isImage);
    const video = files.find(isVideo);
    const documents = files.filter(isDocument);

    if (images.length && validateImages(images)) {
      setFiles(images);
      setFilesType("IMAGE");
      return;
    }

    if (documents.length && validateDocuments(documents)) {
      setFiles(documents);
      setFilesType("FILE");
      return;
    }

    if (!!video && isValidVideo(video)) {
      setFiles([video]);
      setFilesType("VIDEO");
      return;
    }
  };

  const hasBlock = youBlocked || blocked;

  return (
    <>
      {selectedMessage && selectedMessage.type === "REPLY" && !hasBlock && (
        <div className="chat__reply">
          <span className="description">
            Respondendo @{selectedMessage.data.sender.username}
          </span>

          <Button.Icon icon="close" onClick={() => selectMessage(null)} />
        </div>
      )}

      {selectedMessage && selectedMessage.type === "EDIT" && !hasBlock && (
        <EditForm
          message={selectedMessage.data}
          close={() => selectMessage(null)}
        />
      )}

      <form className="chat__form">
        {hasBlock && (
          <div className="form__overlay">
            <b className="text">
              {youBlocked
                ? "Você bloqueou este contato!"
                : "Este contato lhe bloqueou!"}
            </b>
          </div>
        )}

        <EmojiPicker onPick={(emoji) => setText((t) => t + emoji)} />

        <Popover
          icon={<MaterialSymbol icon="expand_less" />}
          position={{
            horizontalAxis: ["right", "left"],
            verticalAxis: ["top"],
          }}
          options={[
            {
              label: "documentos",
              onClick: () => document.getElementById("f-documents")?.click(),
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

        <input
          type="file"
          name="f-documents"
          id="f-documents"
          accept=".json,.txt,.pdf,.csv"
          onChange={handleDocuments}
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

        <Button.Icon icon="mic" onClick={() => setRecordAudio(true)} />

        {files.length > 0 && typeof filesType !== "undefined" && (
          <MediaForm
            text={text}
            files={files}
            type={filesType}
            onSubmit={(data) => {
              onSubmit(data);
              clear();
            }}
            onCancel={() => {
              setFiles([]);
              setFilesType(undefined);
            }}
          />
        )}

        <AudioRecorder
          canRecord={recordAudio}
          stopRecording={() => setRecordAudio(false)}
          onRecord={(audio) => {
            setFilesType("AUDIO");
            setFiles([audio]);
          }}
        />
      </form>
    </>
  );
}
