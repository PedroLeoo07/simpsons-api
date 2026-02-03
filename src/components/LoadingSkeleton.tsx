import { memo } from "react";

interface LoadingSkeletonProps {
  count?: number;
}

function LoadingSkeleton({ count = 8 }: LoadingSkeletonProps) {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="skeleton-card"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="skeleton-image skeleton"></div>
          <div className="skeleton-content">
            <div className="skeleton-title skeleton"></div>
            <div className="skeleton-text skeleton"></div>
            <div className="skeleton-text skeleton"></div>
            <div
              className="skeleton-text skeleton"
              style={{ width: "80%" }}
            ></div>
            <div
              className="skeleton-text skeleton"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(LoadingSkeleton);
