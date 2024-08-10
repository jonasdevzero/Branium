"use client";

import { User } from "@/domain/models";
import { Avatar, Button } from "@/ui/components";
import { useContacts } from "@/ui/hooks";
import { useEffect, useMemo, useState } from "react";
import { Call } from "../types";
import "../css/await.css";

interface Props {
  income: Call.Income;
  onAnswer(accept: boolean): void;
}

export function IncomeCallView({ income, onAnswer }: Props) {
  const [caller, setCaller] = useState<User>();

  const contacts = useContacts();

  useEffect(() => {
    contacts.load(income.from).then(setCaller);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderedCaller = useMemo(() => {
    if (!caller) {
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
      <div className="income__caller">
        <Avatar
          name={caller.name}
          url={caller.image}
          alt={`foto de ${caller.name}`}
        />
        <span className="text info">
          <b>@{caller.username}</b>
          <br />
          <span className="header4">{caller.name} está ligando!</span>
        </span>
      </div>
    );
  }, [caller]);

  return (
    <div className="call__await">
      {renderedCaller}

      <div className="await__options">
        <Button.Icon
          icon="call_end"
          onClick={() => onAnswer(false)}
          title="recusar"
        />

        <Button.Icon
          icon="call"
          onClick={() => onAnswer(true)}
          title="aceitar"
        />
      </div>
    </div>
  );
}
