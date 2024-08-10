import { Button } from "@/ui/components";
import { useCallback, useEffect, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import "./styles.css";

interface Props {
  containerId: string;
}

export function ScrollDown({ containerId }: Props) {
  const [show, setShow] = useState(false);

  const scrollDown = useCallback(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.scrollTo(0, container.scrollHeight);
  }, [containerId]);

  const onScroll = useCallback(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { scrollHeight, scrollTop, clientHeight } = container;

    const position = scrollHeight - scrollTop - clientHeight;

    setShow(position > 300);
  }, [containerId]);

  useEffect(() => {
    const container = document.getElementById(containerId);

    container?.addEventListener("scroll", onScroll);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      container?.removeEventListener("scroll", onScroll);
    };
  }, [containerId, onScroll]);

  return (
    <Button
      type="button"
      className={`scroll__down ${!show ? "scroll__down--hidden" : ""}`}
      onClick={scrollDown}
    >
      <MaterialSymbol icon="arrow_drop_down" size={24} color="#fff" />
    </Button>
  );
}
