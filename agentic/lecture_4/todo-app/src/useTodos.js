import { useEffect, useState } from 'react';

const TODOS_KEY = 'todo-app.todos';

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(TODOS_KEY)) ?? [];
  } catch {
    return [];
  }
}

export function useTodos() {
  const [todos, setTodos] = useState(loadTodos);

  useEffect(() => {
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
  }, [todos]);

  function addTodo(text) {
    const newTodo = { id: crypto.randomUUID(), text, completed: false };
    setTodos((current) => [newTodo, ...current]);
  }

  function toggleTodo(id) {
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  }

  function deleteTodo(id) {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  }

  return { todos, addTodo, toggleTodo, deleteTodo };
}
