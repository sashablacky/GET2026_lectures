const SESSION_KEY = 'todo-app.session';

export const DEMO_USER = {
  email: 'student@example.com',
  password: 'password123',
};

export function login(email, password) {
  const isValid =
    email.trim().toLowerCase() === DEMO_USER.email && password === DEMO_USER.password;

  if (isValid) {
    localStorage.setItem(SESSION_KEY, DEMO_USER.email);
  }
  return isValid;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  return localStorage.getItem(SESSION_KEY);
}
