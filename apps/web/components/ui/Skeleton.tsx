type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse rounded-input bg-surface-muted ${className}`} aria-hidden="true" />;
}
