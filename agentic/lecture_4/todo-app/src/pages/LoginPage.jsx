import { useState } from 'react';
import { DEMO_USER, login } from '../auth.js';
import SmoothInput from '../components/SmoothInput.jsx';
import Logo from '../components/Logo.jsx';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(email, password) {
  const errors = {};
  if (!email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email';
  if (!password) errors.password = 'Password is required';
  else if (password.length < 6) errors.password = 'At least 6 characters';
  return errors;
}

export default function LoginPage({ onLogin, themeMenu }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validate(email, password);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (login(email, password)) {
      onLogin(DEMO_USER.email);
    } else {
      setErrors({ form: 'Wrong email or password' });
    }
  }

  return (
    <main className="page page--center">
      <div className="floating-actions">{themeMenu}</div>
      <div className="hero">
        <span className="chip">
          <Logo /> Todo · v1.0
        </span>
        <h1 className="hero__title">
          Everything you need to do.
          <br />
          <span className="hero__muted">Nothing you don't.</span>
        </h1>
      </div>

      <form className="glass card login" onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span className="field__label">Email</span>
          <SmoothInput
            className={`input ${errors.email ? 'input--error' : ''}`}
            type="text"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {errors.email && <span className="field__error">{errors.email}</span>}
        </label>

        <label className="field">
          <span className="field__label">Password</span>
          <SmoothInput
            className={`input ${errors.password ? 'input--error' : ''}`}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {errors.password && <span className="field__error">{errors.password}</span>}
        </label>

        {errors.form && <p className="form-error">{errors.form}</p>}

        <button className="btn btn--primary btn--block" type="submit">
          Log in
        </button>

        <p className="hint">
          Demo · <code>{DEMO_USER.email}</code> / <code>{DEMO_USER.password}</code>
        </p>
      </form>
    </main>
  );
}
