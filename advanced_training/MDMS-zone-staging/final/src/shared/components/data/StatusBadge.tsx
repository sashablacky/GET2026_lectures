import "./data.css";

export type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

// Default colour per status/severity name used anywhere in the app.
const toneByStatus: Record<string, BadgeTone> = {
  Active: "success",
  Paid: "success",
  Resolved: "success",
  Success: "success",
  Pending: "warning",
  Warning: "warning",
  Acknowledged: "info",
  Info: "info",
  Open: "danger",
  Overdue: "danger",
  Critical: "danger",
  Failed: "danger",
  Deactivated: "neutral",
};

interface StatusBadgeProps {
  status: string;
  tone?: BadgeTone;
}

export default function StatusBadge({ status, tone }: StatusBadgeProps) {
  const resolved = tone ?? toneByStatus[status] ?? "neutral";
  return <span className={`badge badge--${resolved}`}>{status}</span>;
}
