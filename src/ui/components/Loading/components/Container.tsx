import "../styles.css";

export const LoadingContainer: React.FC = () => {
  return (
    <div className="loading__container">
      <h1 className="header1">Branium</h1>

      <span className="loading__spin" />
    </div>
  );
};
