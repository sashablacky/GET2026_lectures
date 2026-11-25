import { NavLink } from "react-router-dom";
import type { MenuItem } from "./menuConfig";

interface SidebarProps {
  items: MenuItem[];
  collapsed: boolean; // desktop: icons only
  mobileOpen: boolean; // small screens: drawer is visible
  onClose: () => void;
}

export default function Sidebar({ items, collapsed, mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {mobileOpen && <div className="app-sidebar__backdrop" onClick={onClose} aria-hidden="true" />}
      <aside className={`app-sidebar ${mobileOpen ? "is-open" : ""}`} aria-label="Main navigation">
        <nav>
          <ul className="app-sidebar__list">
            {items.map(({ label, to, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) => `app-sidebar__link ${isActive ? "is-active" : ""}`}
                  title={collapsed ? label : undefined}
                  onClick={onClose}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span className="app-sidebar__label">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
