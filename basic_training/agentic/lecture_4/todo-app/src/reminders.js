// Reminder helpers. A todo's reminder is stored as:
//   remindAt     - timestamp (ms) of the next reminder, or null
//   repeat       - 'none' | 'daily' | 'weekly'
//   notified     - true once a one-time reminder has fired
//   snoozedUntil - timestamp (ms) of a snoozed reminder, or null

export const REPEAT_OPTIONS = [
  { value: 'none', label: 'Once' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
];

const MINUTE = 60 * 1000;
export const SNOOZE_MINUTES = 10;

function atHour(now, dayOffset, hour) {
  const date = new Date(now);
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, 0, 0, 0);
  return date.getTime();
}

/** Quick choices shown in the reminder menu, relative to `now`. */
export function getReminderPresets(now = Date.now()) {
  const fiveMinutes = 5 * MINUTE;
  const inOneHour = Math.ceil((now + 60 * MINUTE) / fiveMinutes) * fiveMinutes;
  const daysUntilMonday = (8 - new Date(now).getDay()) % 7 || 7;

  const presets = [
    { id: 'hour', label: 'In 1 hour', time: inOneHour },
    { id: 'evening', label: 'This evening', time: atHour(now, 0, 18) },
    { id: 'tomorrow', label: 'Tomorrow morning', time: atHour(now, 1, 9) },
    { id: 'next-week', label: 'Next week', time: atHour(now, daysUntilMonday, 9) },
  ];
  // "This evening" only makes sense while the evening is still ahead.
  return presets.filter((preset) => preset.time > now + 30 * MINUTE);
}

/** The next time a repeating reminder should fire after `now`. */
export function nextOccurrence(remindAt, repeat, now = Date.now()) {
  const stepDays = repeat === 'weekly' ? 7 : 1;
  const date = new Date(remindAt);
  while (date.getTime() <= now) date.setDate(date.getDate() + stepDays);
  return date.getTime();
}

/** When this todo's reminder is due next, or null if nothing is pending. */
export function dueTime(todo) {
  if (todo.completed) return null;
  if (todo.snoozedUntil) return todo.snoozedUntil;
  if (!todo.remindAt || todo.notified) return null;
  return todo.remindAt;
}

/** A one-time reminder that has fired and is waiting for the todo to be done. */
export function isOverdue(todo) {
  return Boolean(todo.remindAt && todo.notified && !todo.completed && !todo.snoozedUntil);
}

function calendarDaysBetween(from, to) {
  const start = new Date(from).setHours(0, 0, 0, 0);
  const end = new Date(to).setHours(0, 0, 0, 0);
  return Math.round((end - start) / (24 * 60 * MINUTE));
}

// The UI is in English, so dates are too (with a 24-hour clock), whatever the system language.
const LOCALE = 'en-GB';

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit' });
}

/** "Today, 18:00", "Tomorrow, 09:00", "Mon, 09:00", "Mon 27 Oct, 09:00" */
export function formatReminder(timestamp, now = Date.now()) {
  const days = calendarDaysBetween(now, timestamp);
  const time = formatTime(timestamp);
  if (days === 0) return `Today, ${time}`;
  if (days === 1) return `Tomorrow, ${time}`;
  if (days === -1) return `Yesterday, ${time}`;
  const date = new Date(timestamp);
  if (days > 1 && days < 7) return `${date.toLocaleDateString(LOCALE, { weekday: 'short' })}, ${time}`;
  return `${date.toLocaleDateString(LOCALE, { weekday: 'short', day: 'numeric', month: 'short' })}, ${time}`;
}

/** Short hint for a preset row: just the time today, otherwise weekday + time. */
export function formatPresetHint(timestamp, now = Date.now()) {
  const time = formatTime(timestamp);
  if (calendarDaysBetween(now, timestamp) === 0) return time;
  return `${new Date(timestamp).toLocaleDateString(LOCALE, { weekday: 'short' })} ${time}`;
}

// Values for <input type="date"> and <input type="time"> in local time.
const pad = (n) => String(n).padStart(2, '0');

export function toDateInputValue(timestamp) {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function toTimeInputValue(timestamp) {
  const d = new Date(timestamp);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromInputValues(date, time) {
  if (!date || !time) return NaN;
  return new Date(`${date}T${time}`).getTime();
}

export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().catch(() => {});
  }
}

export function showSystemNotification(todo) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification('Reminder', { body: todo.text, tag: todo.id });
  } catch {
    // Some browsers only allow notifications from a service worker; the in-app toast still shows.
  }
}
