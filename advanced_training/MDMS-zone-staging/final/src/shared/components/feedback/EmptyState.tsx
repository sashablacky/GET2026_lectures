import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import "./feedback.css";

interface EmptyStateProps {
  title: string;
  message?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  tone?: "default" | "error";
}

export default function EmptyState({ title, message, icon, action, tone = "default" }: EmptyStateProps) {
  return (
    <div className={`empty-state empty-state--${tone}`}>
      <div className="empty-state__icon">{icon ?? <Inbox size={28} />}</div>
      <p className="empty-state__title">{title}</p>
      {message && <p className="empty-state__message">{message}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
