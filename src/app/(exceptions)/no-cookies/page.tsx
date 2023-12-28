import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Branium | Cookies Rejeitados",
  description: "The WebChat with 'E2E'",
};

export default function NoCookies() {
  return (
    <>
      <h1 className="header1">Que pena :/</h1>
      <p className="header4">
        Ao não aceitar os cookies infelizmente não será possível utilizar o
        site!
      </p>
    </>
  );
}
