import { useState } from 'react';
import { useTodos } from '../useTodos.js';
import TodoForm from '../components/TodoForm.jsx';
import TodoItem from '../components/TodoItem.jsx';
import SegmentedControl from '../components/SegmentedControl.jsx';
import Logo from '../components/Logo.jsx';

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

const FILTERS = {
  all: () => true,
  active: (todo) => !todo.completed,
  completed: (todo) => todo.completed,
};

export default function TodoPage({ user, onLogout, themeMenu }) {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const [filter, setFilter] = useState('all');

  const visibleTodos = todos.filter(FILTERS[filter]);
  const remainingCount = todos.filter(FILTERS.active).length;

  return (
    <>
      <header className="nav glass">
        <span className="nav__brand">
          <Logo /> Todo
        </span>
        <span className="nav__user">{user}</span>
        {themeMenu}
        <button className="btn btn--ghost" onClick={onLogout}>
          Log out
        </button>
      </header>

      <main className="page">
        <div className="hero hero--left">
          <h1 className="hero__title">
            Today.
            <br />
            <span className="hero__muted">
              {remainingCount === 0
                ? 'All clear.'
                : `${remainingCount} ${remainingCount === 1 ? 'thing' : 'things'} left.`}
            </span>
          </h1>
        </div>

        <section className="glass card">
          <TodoForm onAdd={addTodo} />

          <div className="toolbar">
            <SegmentedControl
              options={FILTER_OPTIONS}
              value={filter}
              onChange={setFilter}
              label="Filter todos"
            />
            <span className="counter">
              {remainingCount} {remainingCount === 1 ? 'item' : 'items'} left
            </span>
          </div>

          {visibleTodos.length === 0 ? (
            <p className="empty">
              {todos.length === 0 ? 'No todos yet. Add your first one above.' : 'Nothing here.'}
            </p>
          ) : (
            <ul className="todo-list">
              {visibleTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
