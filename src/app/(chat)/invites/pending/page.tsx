"use client";

import { Card, Room } from "@/ui/components";

export default function InvitesPending() {
  return (
    <div className="invites__container">
      <div className="invites__title">
        <h3 className="text">CONVITES PENDENTES</h3>
      </div>

      <div className="invites__list">
        <Card>
          <Room name="Dev Zero" username="devzero" type="secondary" />

          <button className="invite__action">rejeitar</button>
          <button className="invite__action">aceitar</button>
        </Card>
      </div>
    </div>
  );
}
