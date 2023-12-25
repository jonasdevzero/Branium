import "./styles.css";

export default function Home() {
  return (
    <main>
      <h1>Branium</h1>

      <div id="messages">
        <span className="message message--me">Hello</span>
      </div>

      <form>
        <input type="text" />
        <button>send</button>
      </form>
    </main>
  );
}
