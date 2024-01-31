import "@/ui/css/components/skeleton.css";

export function ContactSkeleton({}: {}) {
  return (
    <div className="skeleton__wrap card">
      <div className="skeleton__wrap room">
        <span className="skeleton__box avatar"></span>

        <div className="skeleton__wrap">
          <span className="skeleton__box text"></span>
          <span className="skeleton__box description"></span>
        </div>
      </div>
    </div>
  );
}
