import { LoaderCircle } from "lucide-react";
import "./feedback.css";

interface LoaderProps {
  label?: string;
  fullPage?: boolean;
}

export default function Loader({ label = "Loading…", fullPage }: LoaderProps) {
  return (
    <div className={`loader ${fullPage ? "loader--page" : ""}`} role="status" aria-live="polite">
      <LoaderCircle className="loader__icon" size={fullPage ? 32 : 22} />
      <span>{label}</span>
    </div>
  );
}
