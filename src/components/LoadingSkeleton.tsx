interface LoadingSkeletonProps {
  count?: number;
}

export default function LoadingSkeleton({ count = 8 }: LoadingSkeletonProps) {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-image skeleton"></div>
          <div className="skeleton-content">
            <div className="skeleton-title skeleton"></div>
            <div className="skeleton-text skeleton"></div>
            <div className="skeleton-text skeleton"></div>
            <div className="skeleton-text skeleton"></div>
            <div className="skeleton-text skeleton"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
