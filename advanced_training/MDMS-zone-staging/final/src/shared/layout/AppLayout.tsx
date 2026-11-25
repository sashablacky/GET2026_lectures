import { useEffect, useState } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { menuConfig } from "./menuConfig";
import type { AppRole } from "./menuConfig";
import "./layout.css";

const ROLE_KEY = "mdms.lastRole";
const COLLAPSED_KEY = "mdms.sidebarCollapsed";
const MOBILE_QUERY = "(max-width: 900px)";

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Not critical: only remembers UI preferences.
  }
}

function lastRole(): AppRole {
  const saved = readStorage(ROLE_KEY);
  return saved === "zone" || saved === "enterprise" ? saved : "user";
}

interface AppLayoutProps {
  // Omit for pages shared by all roles (e.g. /profile): the last visited role area is used.
  role?: AppRole;
}

export default function AppLayout({ role }: AppLayoutProps) {
  const activeRole = role ?? lastRole();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => readStorage(COLLAPSED_KEY) === "true");
  const navigation = useNavigation();

  useEffect(() => {
    if (role) writeStorage(ROLE_KEY, role);
  }, [role]);

  const toggleMenu = () => {
    if (window.matchMedia(MOBILE_QUERY).matches) {
      setMobileOpen((open) => !open);
      return;
    }
    const next = !collapsed;
    setCollapsed(next);
    writeStorage(COLLAPSED_KEY, String(next));
  };

  return (
    <div className={`app ${collapsed ? "app--collapsed" : ""}`}>
      {navigation.state === "loading" && <div className="app-progress" role="progressbar" aria-label="Loading page" />}
      <Header role={activeRole} onMenuClick={toggleMenu} />
      <Sidebar
        items={menuConfig[activeRole]}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
