import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import { EllipsisVertical } from "lucide-react";
import type { RowAction } from "./DataTable";
import "./data.css";

const MENU_WIDTH = 180;

interface RowActionsMenuProps<T> {
  row: T;
  actions: RowAction<T>[];
}

// Rendered in a portal with fixed position so the table's horizontal
// scroll container does not clip it.
export default function RowActionsMenu<T>({ row, actions }: RowActionsMenuProps<T>) {
  const [position, setPosition] = useState<CSSProperties | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const open = position !== null;

  useEffect(() => {
    if (!open) return;
    const close = () => setPosition(null);
    const onPointer = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!menuRef.current?.contains(target) && !buttonRef.current?.contains(target)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    menuRef.current?.querySelector("button")?.focus();
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const toggle = () => {
    if (open) {
      setPosition(null);
      return;
    }
    const rect = buttonRef.current!.getBoundingClientRect();
    const estimatedHeight = actions.length * 38 + 8;
    const openUp = rect.bottom + estimatedHeight > window.innerHeight;
    setPosition({
      position: "fixed",
      left: Math.max(8, rect.right - MENU_WIDTH),
      width: MENU_WIDTH,
      ...(openUp ? { bottom: window.innerHeight - rect.top + 4 } : { top: rect.bottom + 4 }),
    });
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="icon-btn"
        aria-label="Row actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
      >
        <EllipsisVertical size={18} />
      </button>
      {open &&
        createPortal(
          <div ref={menuRef} className="menu" role="menu" style={position}>
            {actions.map((action, i) => {
              const label = typeof action.label === "function" ? action.label(row) : action.label;
              const danger = typeof action.danger === "function" ? action.danger(row) : action.danger;
              return (
                <button
                  key={i}
                  type="button"
                  role="menuitem"
                  className={`menu__item ${danger ? "menu__item--danger" : ""}`}
                  onClick={() => {
                    setPosition(null);
                    action.onClick(row);
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
