import { useState } from 'react';
import './AuthorizationPage.css';

function AuthorizationPage() {
  const [formState, setFormState] = useState({ email: '', password: '', remember: false });
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formState.email || !formState.password) {
      setMessage('Please provide both an email address and password.');
      return;
    }

    setMessage(
      `Welcome back${formState.remember ? ', we will keep you signed in.' : '! You can now access your dashboard.'}`
    );
  };

  return (
    <div className="authorization-page">
      <section className="auth-card">
        <header className="auth-header">
          <h1>Sign in to your account</h1>
          <p>Enter your credentials below to continue.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="email">
            Email address
            <input
              className="auth-input"
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formState.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </label>

          <label className="auth-label" htmlFor="password">
            Password
            <input
              className="auth-input"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formState.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </label>

          <label className="auth-checkbox">
            <input
              type="checkbox"
              name="remember"
              checked={formState.remember}
              onChange={handleChange}
            />
            <span>Keep me signed in</span>
          </label>

          <button className="auth-button" type="submit">
            Sign in
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}
      </section>
    </div>
  );
}

export default AuthorizationPage;
