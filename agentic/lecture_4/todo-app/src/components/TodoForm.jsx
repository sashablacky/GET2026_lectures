import { useState } from 'react';
import SmoothInput from './SmoothInput.jsx';

export default function TodoForm({ onAdd }) {
  const [text, setText] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
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
    </form>
  );
}
