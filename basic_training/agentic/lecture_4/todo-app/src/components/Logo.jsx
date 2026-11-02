/** App mark: a rounded square with the same thin check used by the todo checkboxes. */
export default function Logo() {
  return (
    <svg className="logo" viewBox="0 0 16 16" aria-hidden="true">
      <rect width="16" height="16" rx="4.5" fill="currentColor" />
      <path className="logo__check" d="M4.75 8.25 7 10.5l4.25-4.5" />
    </svg>
  );
}
