import {
  Bell,
  ChartColumn,
  Gauge,
  LayoutDashboard,
  MapPin,
  Receipt,
  ScrollText,
  Settings,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AppRole = "user" | "zone" | "enterprise";

export interface MenuItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const roleLabels: Record<AppRole, string> = {
  user: "End-user",
  zone: "Zone admin",
  enterprise: "Enterprise",
};

// Sidebar items per role. AppLayout renders the sidebar from this config.
export const menuConfig: Record<AppRole, MenuItem[]> = {
  user: [
    { label: "Dashboard", to: "/user/dashboard", icon: LayoutDashboard },
    { label: "Bills & Payments", to: "/user/bills", icon: Receipt },
    { label: "Meter Data", to: "/user/meter-data", icon: Gauge },
    { label: "Alerts", to: "/user/alerts", icon: Bell },
  ],
  zone: [
    { label: "Dashboard", to: "/zone/dashboard", icon: LayoutDashboard },
    { label: "Meter Management", to: "/zone/meters", icon: Gauge },
    { label: "User Management", to: "/zone/users", icon: Users },
    { label: "Reports & Analytics", to: "/zone/reports", icon: ChartColumn },
    { label: "Alerts", to: "/zone/alerts", icon: Bell },
    { label: "Settings", to: "/zone/settings", icon: Settings },
  ],
  enterprise: [
    { label: "Dashboard", to: "/enterprise/dashboard", icon: LayoutDashboard },
    { label: "Zone Management", to: "/enterprise/zones", icon: MapPin },
    { label: "Meter Management", to: "/enterprise/meters", icon: Gauge },
    { label: "User & Role Management", to: "/enterprise/users", icon: Users },
    { label: "Reports & Analytics", to: "/enterprise/reports", icon: ChartColumn },
    { label: "Alerts", to: "/enterprise/alerts", icon: Bell },
    { label: "Audit Logs", to: "/enterprise/audit-logs", icon: ScrollText },
    { label: "Settings", to: "/enterprise/settings", icon: Settings },
  ],
};

export const alertsPath: Record<AppRole, string> = {
  user: "/user/alerts",
  zone: "/zone/alerts",
  enterprise: "/enterprise/alerts",
};
