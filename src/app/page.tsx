import Link from "next/link";
import "./styles.css";

export default function Home() {
  return (
    <>
      <div className="hero">
        <h1 className="title">Branium</h1>
        <h2 className="header3">Converse com segurança o tempo todo.</h2>
      </div>

      <p className="text">
        Um sistema de mensagens focado em trazer a segurança e praticidade para
        as conversas do dia a dia, contando com <br /> criptografia de ponta a
        ponta em todas as mensagens.
      </p>

      <div className="actions">
        <Link href="#" className="header4">
          Entrar
        </Link>

        <Link href="/register" className="header4">
          Cadastrar
        </Link>
      </div>
    </>
  );
}
