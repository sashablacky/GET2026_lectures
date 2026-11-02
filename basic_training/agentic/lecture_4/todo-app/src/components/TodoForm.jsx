import { useState } from 'react';
import SmoothInput from './SmoothInput.jsx';
import ReminderMenu from './ReminderMenu.jsx';

export default function TodoForm({ onAdd }) {
  const [text, setText] = useState('');
  const [reminder, setReminder] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed, reminder);
    setText('');
    setReminder(null);
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form__row">
        <SmoothInput
          className="input"
          placeholder="What needs to be done?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="New todo"
        />
        <button className="btn btn--primary" type="submit" disabled={!text.trim()}>
          Add
        </button>
      </div>
      <div className="todo-form__options">
        <ReminderMenu value={reminder} onChange={setReminder} />
      </div>
    </form>
  );
}
