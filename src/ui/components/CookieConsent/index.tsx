"use client";

/* eslint-disable react/no-unescaped-entities */
import { hasCookie, setCookie } from "cookies-next";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./styles.css";
import { useRouter } from "next/navigation";
import { Button } from "..";

export const CookieConsent: React.FC = () => {
  const [hasConsent, setHasConsent] = useState(true);

  const router = useRouter();

  const rejectCookies = () => router.replace("/no-cookies");

  const acceptCookies = () => {
    setCookie("cookie-consent", "true", {
      path: "/",
      sameSite: "none",
      secure: true,
    });
    setHasConsent(true);
  };

  useEffect(() => {
    setHasConsent(hasCookie("cookie-consent", { path: "/" }));
  }, []);

  if (hasConsent) return null;

  return (
    <div className="cookie__container">
      <h6 className="header4">Cookies</h6>

      <p className="text">
        Este site utiliza cookies para aprimorar sua experiência. Ao clicar em
        "Aceitar", você concorda com o uso de cookies essenciais. Saiba mais em{" "}
        <Link href={"/terms#privacy"}>Políticas de privacidade</Link>.
      </p>

      <div className="container__actions">
        <Button onClick={rejectCookies}>Rejeitar</Button>

        <Button onClick={acceptCookies}>Aceitar</Button>
      </div>
    </div>
  );
};
