import { useEffect, useState } from 'react';
import { SNOOZE_MINUTES, nextOccurrence } from './reminders.js';

const TODOS_KEY = 'todo-app.todos';

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(TODOS_KEY)) ?? [];
  } catch {
    return [];
  }
}

function reminderFields(reminder) {
  return {
    remindAt: reminder?.remindAt ?? null,
    repeat: reminder?.repeat ?? 'none',
    notified: false,
    snoozedUntil: null,
  };
}

export function useTodos() {
  const [todos, setTodos] = useState(loadTodos);

  useEffect(() => {
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
  }, [todos]);

  function updateTodo(id, changes) {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, ...(typeof changes === 'function' ? changes(todo) : changes) } : todo
      )
    );
  }

  function addTodo(text, reminder = null) {
    const newTodo = { id: crypto.randomUUID(), text, completed: false, ...reminderFields(reminder) };
    setTodos((current) => [newTodo, ...current]);
  }

  function toggleTodo(id) {
    updateTodo(id, (todo) => ({ completed: !todo.completed }));
  }

  function completeTodo(id) {
    updateTodo(id, { completed: true });
  }

  function deleteTodo(id) {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  }

  function setReminder(id, reminder) {
    updateTodo(id, reminderFields(reminder));
  }

  // Called once a reminder has fired: clear a snooze, move a repeating
  // reminder to its next time, or mark a one-time reminder as done.
  function markReminded(id) {
    updateTodo(id, (todo) => {
      if (todo.snoozedUntil) return { snoozedUntil: null };
      if (todo.repeat !== 'none') return { remindAt: nextOccurrence(todo.remindAt, todo.repeat) };
      return { notified: true };
    });
  }

  function snoozeReminder(id) {
    updateTodo(id, { snoozedUntil: Date.now() + SNOOZE_MINUTES * 60 * 1000 });
  }

  return {
    todos,
    addTodo,
    toggleTodo,
    completeTodo,
    deleteTodo,
    setReminder,
    markReminded,
    snoozeReminder,
  };
}
