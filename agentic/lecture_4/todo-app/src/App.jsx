import { useState } from 'react';
import { getCurrentUser, logout } from './auth.js';
import LoginPage from './pages/LoginPage.jsx';
import TodoPage from './pages/TodoPage.jsx';

export default function App() {
  const [user, setUser] = useState(getCurrentUser);

  function handleLogout() {
    logout();
    setUser(null);
  }

  return (
    <>
      <div className="sky" aria-hidden="true" />
      {user ? (
        <TodoPage user={user} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={setUser} />
      )}
    </>
  );
}
