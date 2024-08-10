import "@/ui/css/components/skeleton.css";

interface Props {
  actions?: number;
}

export function ContactSkeleton({ actions = 0 }: Props) {
  return (
    <div className="skeleton__wrap card">
      <div className="skeleton__wrap room">
        <span className="skeleton__box avatar"></span>

        <div className="skeleton__wrap">
          <span className="skeleton__box text"></span>
          <span className="skeleton__box description"></span>
        </div>
      </div>

      {actions > 0 && (
        <div className="skeleton__wrap actions">
          {new Array(actions).fill("").map((_, i) => (
            <span key={i} className="skeleton__box icon"></span>
          ))}
        </div>
      )}
    </div>
  );
}
