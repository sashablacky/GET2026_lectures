import { useCallback, useRef, useState } from 'react';
import SegmentedControl from './SegmentedControl.jsx';
import { BellIcon, CheckIcon, ChevronIcon, RepeatIcon } from './icons.jsx';
import { useDismiss } from '../useDismiss.js';
import {
  REPEAT_OPTIONS,
  formatPresetHint,
  formatReminder,
  fromInputValues,
  getReminderPresets,
  requestNotificationPermission,
  toDateInputValue,
  toTimeInputValue,
} from '../reminders.js';

/**
 * A button that opens a dropdown for choosing a reminder.
 * `value` is { remindAt, repeat } or null; `onChange` receives the same shape.
 * `trigger` is 'chip' (labelled pill, used under the new-todo input)
 * or 'compact' (badge / bell icon, used on a todo row).
 */
export default function ReminderMenu({ value, onChange, trigger = 'chip', isOverdue = false, align = 'start' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customError, setCustomError] = useState('');
  const menuRef = useRef(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setIsCustomOpen(false);
    setCustomError('');
  }, []);
  useDismiss(menuRef, isOpen, close);

  const now = Date.now();
  const presets = isOpen ? getReminderPresets(now) : [];
  const repeat = value?.repeat ?? 'none';
  const isPresetValue = presets.some((preset) => preset.time === value?.remindAt);

  // Defaults for the custom pickers: the current reminder, or tomorrow at 9:00.
  const customStart = value?.remindAt ?? getReminderPresets(now).find((p) => p.id === 'tomorrow').time;
  const [customDate, setCustomDate] = useState(() => toDateInputValue(customStart));
  const [customTime, setCustomTime] = useState(() => toTimeInputValue(customStart));

  function setReminder(remindAt) {
    if (!value) requestNotificationPermission();
    onChange({ remindAt, repeat });
  }

  function applyCustom(date, time) {
    const timestamp = fromInputValues(date, time);
    if (Number.isNaN(timestamp)) return;
    if (timestamp <= Date.now()) {
      setCustomError('Pick a time in the future');
      return;
    }
    setCustomError('');
    setReminder(timestamp);
  }

  function toggleCustom() {
    if (!isCustomOpen) {
      const start = value?.remindAt ?? customStart;
      setCustomDate(toDateInputValue(start));
      setCustomTime(toTimeInputValue(start));
      if (!value) applyCustom(toDateInputValue(start), toTimeInputValue(start));
    }
    setIsCustomOpen((open) => !open);
  }

  // Enter in the date/time pickers shouldn't submit the surrounding todo form.
  function preventSubmit(event) {
    if (event.key === 'Enter') event.preventDefault();
  }

  const label = value ? formatReminder(value.remindAt, now) : 'Remind me';

  return (
    <div className={`reminder-menu ${isOpen ? 'is-open' : ''}`} ref={menuRef}>
      {trigger === 'chip' ? (
        <button
          type="button"
          className={`option-chip ${value ? 'is-set' : ''}`}
          onClick={() => (isOpen ? close() : setIsOpen(true))}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          <BellIcon />
          <span>{label}</span>
          {repeat !== 'none' && <RepeatIcon />}
          <span className="option-chip__chevron">
            <ChevronIcon />
          </span>
        </button>
      ) : value ? (
        <button
          type="button"
          className={`reminder-badge ${isOverdue ? 'is-overdue' : ''}`}
          onClick={() => (isOpen ? close() : setIsOpen(true))}
          aria-expanded={isOpen}
          aria-label={`Reminder: ${label}. Change reminder`}
        >
          <BellIcon size={12} />
          <span>{label}</span>
          {repeat !== 'none' && <RepeatIcon size={11} />}
        </button>
      ) : (
        <button
          type="button"
          className="icon-btn icon-btn--reminder"
          onClick={() => (isOpen ? close() : setIsOpen(true))}
          aria-expanded={isOpen}
          aria-label="Add reminder"
        >
          <BellIcon size={15} />
        </button>
      )}

      <div
        className={`popover reminder-panel ${align === 'end' ? 'popover--end' : ''} ${isOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-label="Reminder"
      >
        <p className="popover__title">Remind me</p>

        <div className="menu-list">
          {presets.map((preset) => {
            const isActive = preset.time === value?.remindAt;
            return (
              <button
                key={preset.id}
                type="button"
                className={`menu-item ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  setIsCustomOpen(false);
                  setCustomError('');
                  setReminder(preset.time);
                }}
              >
                <span className="menu-item__check">{isActive && <CheckIcon />}</span>
                <span className="menu-item__label">{preset.label}</span>
                <span className="menu-item__hint">{formatPresetHint(preset.time, now)}</span>
              </button>
            );
          })}

          <button
            type="button"
            className={`menu-item ${value && !isPresetValue ? 'is-active' : ''}`}
            onClick={toggleCustom}
            aria-expanded={isCustomOpen}
          >
            <span className="menu-item__check">{value && !isPresetValue && <CheckIcon />}</span>
            <span className="menu-item__label">Pick date &amp; time</span>
            <span className={`menu-item__chevron ${isCustomOpen ? 'is-open' : ''}`}>
              <ChevronIcon />
            </span>
          </button>
        </div>

        <div className={`collapsible ${isCustomOpen ? 'is-open' : ''}`}>
          <div className="collapsible__inner">
            <div className="custom-time">
              <input
                className="input input--sm"
                type="date"
                value={customDate}
                min={toDateInputValue(now)}
                onChange={(e) => {
                  setCustomDate(e.target.value);
                  applyCustom(e.target.value, customTime);
                }}
                onKeyDown={preventSubmit}
                aria-label="Reminder date"
              />
              <input
                className="input input--sm"
                type="time"
                value={customTime}
                onChange={(e) => {
                  setCustomTime(e.target.value);
                  applyCustom(customDate, e.target.value);
                }}
                onKeyDown={preventSubmit}
                aria-label="Reminder time"
              />
            </div>
            {customError && <p className="custom-time__error">{customError}</p>}
          </div>
        </div>

        <div className={`collapsible ${value ? 'is-open' : ''}`}>
          <div className="collapsible__inner">
            <p className="popover__label">Repeat</p>
            <SegmentedControl
              options={REPEAT_OPTIONS}
              value={repeat}
              onChange={(nextRepeat) => onChange({ ...value, repeat: nextRepeat })}
              label="Repeat"
            />
          </div>
        </div>

        <div className="popover__footer">
          {value && (
            <button
              type="button"
              className="text-btn"
              onClick={() => {
                onChange(null);
                close();
              }}
            >
              Remove reminder
            </button>
          )}
          <button type="button" className="btn btn--primary btn--sm" onClick={close}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
