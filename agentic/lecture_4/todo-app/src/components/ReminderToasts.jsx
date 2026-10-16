import { BellIcon } from './icons.jsx';
import { SNOOZE_MINUTES } from '../reminders.js';

/** Notices for reminders that just became due, stacked in the corner. */
export default function ReminderToasts({ toasts, onComplete, onSnooze, onDismiss }) {
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast" role="status">
          <div className="toast__head">
            <BellIcon size={12} />
            <span>Reminder</span>
            <button className="toast__close" onClick={() => onDismiss(toast.id)} aria-label="Dismiss reminder">
              ×
            </button>
          </div>
          <p className="toast__text">{toast.text}</p>
          <div className="toast__actions">
            <button className="btn btn--primary btn--sm" onClick={() => onComplete(toast.id)}>
              Mark done
            </button>
            <button className="btn btn--ghost btn--sm" onClick={() => onSnooze(toast.id)}>
              Snooze {SNOOZE_MINUTES} min
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
