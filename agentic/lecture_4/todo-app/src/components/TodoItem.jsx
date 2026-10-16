export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={`todo ${todo.completed ? 'todo--done' : ''}`}>
      <label className="todo__label">
        <input
          className="checkbox"
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span className="todo__text">{todo.text}</span>
      </label>
      <button
        className="icon-btn"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete "${todo.text}"`}
      >
        ×
      </button>
    </li>
  );
}
