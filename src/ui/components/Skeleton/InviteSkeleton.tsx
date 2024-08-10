import "@/ui/css/components/skeleton.css";

interface Props {
  buttons?: number;
}

export function InviteSkeleton({ buttons = 1 }: Props) {
  return (
    <div className="skeleton__wrap card">
      <div className="skeleton__wrap room">
        <span className="skeleton__box avatar"></span>

        <div className="skeleton__wrap">
          <span className="skeleton__box text"></span>
          <span className="skeleton__box description"></span>
        </div>
      </div>

      {new Array(buttons).fill("").map((_, i) => (
        <span key={i} className="skeleton__box button"></span>
      ))}
    </div>
  );
}
