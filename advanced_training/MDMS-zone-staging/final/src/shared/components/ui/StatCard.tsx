import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Skeleton from "../feedback/Skeleton";
import "./ui.css";

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  link?: { to: string; label: string };
  tone?: "default" | "success" | "warning" | "danger";
  loading?: boolean;
}

export default function StatCard({
  label,
  value,
  hint,
  icon,
  link,
  tone = "default",
  loading,
}: StatCardProps) {
  return (
    <div className={`card stat-card stat-card--${tone}`}>
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        {icon && <span className="stat-card__icon">{icon}</span>}
      </div>
      <div className="stat-card__value mono">
        {loading ? <Skeleton width="60%" height={30} /> : value}
      </div>
      {hint && !loading && <div className="stat-card__hint">{hint}</div>}
      {link && (
        <Link to={link.to} className="link stat-card__link">
          {link.label} <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}
