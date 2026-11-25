import "./feedback.css";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number;
}

export default function Skeleton({ width = "100%", height = 14, radius = 6 }: SkeletonProps) {
  return (
    <span
      className="skeleton"
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}
