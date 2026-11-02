import { useEffect, useRef } from 'react';
import { dueTime } from './reminders.js';

const CHECK_INTERVAL_MS = 5000;

/** Checks the todos every few seconds and calls `onDue(todo)` for each reminder that is due. */
export function useReminders(todos, onDue) {
  const todosRef = useRef(todos);
  const onDueRef = useRef(onDue);
  todosRef.current = todos;
  onDueRef.current = onDue;

  // Remembers which reminders already fired, so one isn't reported twice
  // while the todo update is still on its way.
  const firedRef = useRef(new Set());

  useEffect(() => {
    function check() {
      const now = Date.now();
      for (const todo of todosRef.current) {
        const due = dueTime(todo);
        if (due === null || due > now) continue;
        const key = `${todo.id}:${due}`;
        if (firedRef.current.has(key)) continue;
        firedRef.current.add(key);
        onDueRef.current(todo);
      }
    }

    check();
    const timer = setInterval(check, CHECK_INTERVAL_MS);
    document.addEventListener('visibilitychange', check);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', check);
    };
  }, []);
}
