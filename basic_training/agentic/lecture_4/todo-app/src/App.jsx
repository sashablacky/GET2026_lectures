import { useState } from 'react';
import { getCurrentUser, logout } from './auth.js';
import { useTheme } from './theme.js';
import LoginPage from './pages/LoginPage.jsx';
import TodoPage from './pages/TodoPage.jsx';
import ThemeMenu from './components/ThemeMenu.jsx';

export default function App() {
  const [user, setUser] = useState(getCurrentUser);
  const [theme, setTheme] = useTheme();

  function handleLogout() {
    logout();
    setUser(null);
  }

  const themeMenu = <ThemeMenu theme={theme} onChange={setTheme} />;

  return (
    <>
      <div className="sky" aria-hidden="true" />
      {user ? (
        <TodoPage user={user} onLogout={handleLogout} themeMenu={themeMenu} />
      ) : (
        <LoginPage onLogin={setUser} themeMenu={themeMenu} />
      )}
    </>
  );
}
