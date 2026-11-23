'use client';

import { useState } from 'react';
import { TaskItem } from './TaskItem';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Learn React props', completed: false },
    { id: '2', title: 'Build a task list', completed: true },
    { id: '3', title: 'Style with Tailwind CSS', completed: false },
  ]);

  function handleToggle(id: string) {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
  }

  function handleDelete(id: string) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }

  return (
    <main className="max-w-md mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">My Tasks</h1>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks remaining.</p>
        ) : (
          tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
          ))
        )}
      </div>
    </main>
  );
}
