import { Avatar, Button } from "@/ui/components";
import { useMemo } from "react";
import { Call } from "../types";
import "../css/await.css";

interface Props {
  target: Call.CallingTarget;
  onCancel(): void;
}

export function CallingView({ target, onCancel }: Props) {
  const callTarget = useMemo(() => {
    if (!target) {
      return (
        <div className="income__caller">
          <div className="skeleton__box avatar"></div>
          <span className="caller__info">
            <span className="skeleton__box text"></span>
            <br />
            <span className="skeleton__box header4"></span>
          </span>
        </div>
      );
    }

    return (
      <div className="call__target">
        <Avatar
          name={target.name}
          url={target.image}
          alt={`foto de ${target.name}`}
        />

        <span className="text info">
          {target.username && (
            <>
              <b>@{target.username}</b>
              <br />
            </>
          )}

          <span className="header4">Ligando para {target.name}!</span>
        </span>
      </div>
    );
  }, [target]);

  return (
    <div className="call__await">
      {callTarget}

      <div className="await__options">
        <Button.Icon icon="call_end" onClick={onCancel} title="cancelar" />
      </div>
    </div>
  );
}
