import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Menu, Moon, Sun, Zap } from "lucide-react";
import { useTheme } from "../theme/theme-context";
import { demoAccounts } from "../session/demoAccounts";
import { alertsPath, menuConfig, roleLabels } from "./menuConfig";
import type { AppRole } from "./menuConfig";
import ProfileMenu from "./ProfileMenu";

// Static until notifications are loaded from the server (later phase).
const UNREAD_COUNT = 3;

const languages = [
  { value: "en", label: "EN" },
  { value: "hi", label: "हिन्दी" },
  { value: "kn", label: "ಕನ್ನಡ" },
];

interface HeaderProps {
  role: AppRole;
  onMenuClick: () => void;
}

export default function Header({ role, onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  // Screen only: translations come in a later phase.
  const [language, setLanguage] = useState("en");
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <header className="app-header">
      <button type="button" className="icon-btn" onClick={onMenuClick} aria-label="Toggle navigation">
        <Menu size={20} />
      </button>
      <Link to={menuConfig[role][0].to} className="app-header__brand">
        <Zap size={20} /> MDMS
      </Link>
      <span className="app-header__role">{roleLabels[role]}</span>

      <div className="app-header__right">
        <Link to={alertsPath[role]} className="icon-btn" aria-label={`Notifications, ${UNREAD_COUNT} unread`}>
          <Bell size={20} />
          <span className="count-badge">{UNREAD_COUNT}</span>
        </Link>
        <button
          type="button"
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${nextTheme} theme`}
          title={`Switch to ${nextTheme} theme`}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <label className="sr-only" htmlFor="language-select">
          Language
        </label>
        <select
          id="language-select"
          className="app-header__language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languages.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
        <ProfileMenu account={demoAccounts[role]} roleLabel={roleLabels[role]} />
      </div>
    </header>
  );
}
