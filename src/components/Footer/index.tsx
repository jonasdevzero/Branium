import Image from "next/image";
import "./styles.css";

export const Footer: React.FC = () => {
  return (
    <footer>
      <h6 className="header4">Branium</h6>

      <nav>
        <a href="#" className="text">
          Termos
        </a>

        <a href="#" className="text">
          Privacidade
        </a>
      </nav>

      <div className="references">
        <p className="text">© Copyright - jonasdevzero</p>

        <a
          href="https://github.com/jonasdevzero"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            src={"/icons/github.svg"}
            width={32}
            height={32}
            alt="github icon"
          />
        </a>

        <a
          href="https://www.linkedin.com/in/jonasdevzero/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            src={"/icons/linkedin.svg"}
            width={32}
            height={32}
            alt="linkedin icon"
          />
        </a>
      </div>
    </footer>
  );
};
