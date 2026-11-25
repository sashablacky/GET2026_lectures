import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, User } from "lucide-react";
import type { DemoAccount } from "../session/demoAccounts";

interface ProfileMenuProps {
  account: DemoAccount;
  roleLabel: string;
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function ProfileMenu({ account, roleLabel }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="profile-menu" ref={rootRef}>
      <button
        type="button"
        className="profile-menu__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="avatar" aria-hidden="true">
          {initials(account.name)}
        </span>
        <span className="profile-menu__name">{account.name}</span>
        <ChevronDown size={16} />
      </button>
      {open && (
        <div className="menu profile-menu__dropdown" role="menu">
          <div className="profile-menu__info">
            <strong>{account.name}</strong>
            <span className="muted">{account.email}</span>
            <span className="muted">{roleLabel}</span>
          </div>
          <Link to="/profile" role="menuitem" className="menu__item" onClick={() => setOpen(false)}>
            <User size={16} /> Profile & Settings
          </Link>
          <button
            type="button"
            role="menuitem"
            className="menu__item menu__item--danger"
            onClick={() => navigate("/login")}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
