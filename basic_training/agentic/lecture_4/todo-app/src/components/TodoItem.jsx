import ReminderMenu from './ReminderMenu.jsx';
import { isOverdue } from '../reminders.js';

export default function TodoItem({ todo, onToggle, onDelete, onSetReminder }) {
  const reminder = todo.remindAt ? { remindAt: todo.remindAt, repeat: todo.repeat ?? 'none' } : null;

  return (
    <li className={`todo ${todo.completed ? 'todo--done' : ''}`}>
      <label className="todo__label">
        <span className="checkbox">
          <input
            className="checkbox__input"
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          <svg className="checkbox__icon" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M6.25 10.25 8.75 12.75 13.75 7.5" pathLength="1" />
          </svg>
        </span>
        <span className="todo__text">{todo.text}</span>
      </label>
      <ReminderMenu
        trigger="compact"
        align="end"
        value={reminder}
        onChange={(next) => onSetReminder(todo.id, next)}
        isOverdue={isOverdue(todo)}
      />
      <button
        className="icon-btn icon-btn--delete"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete "${todo.text}"`}
      >
        ×
      </button>
    </li>
  );
}
