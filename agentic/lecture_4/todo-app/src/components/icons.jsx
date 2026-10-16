// Small line icons, drawn with the current text color.

export function BellIcon({ size = 14 }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 11.5V7a4 4 0 0 1 8 0v4.5l1.25 1.25H2.75z" />
      <path d="M6.5 14.25a1.6 1.6 0 0 0 3 0" />
    </svg>
  );
}

export function RepeatIcon({ size = 12 }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2.75 7.5V7a3 3 0 0 1 3-3h7.5M11 1.75 13.25 4 11 6.25" />
      <path d="M13.25 8.5V9a3 3 0 0 1-3 3h-7.5M5 14.25 2.75 12 5 9.75" />
    </svg>
  );
}

export function ChevronIcon({ size = 12 }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

export function CheckIcon({ size = 14 }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 8.5 6.5 11.5 12.5 4.75" />
    </svg>
  );
}
