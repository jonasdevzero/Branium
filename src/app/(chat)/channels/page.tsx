"use client";

import { Form, Header } from "@/ui/components/Chat";
import "./styles.css";

export default function Channels() {
  return (
    <div className="container">
      <Header name="DevZero" />

      <div className="messages"></div>

      <Form />
    </div>
  );
}
