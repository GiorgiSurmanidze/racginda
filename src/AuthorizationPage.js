import { useEffect, useRef, useState } from 'react';
import './AuthorizationPage.css';

function AuthorizationPage() {
  const [formState, setFormState] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const pendingLoginRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pendingLoginRef.current) {
        clearTimeout(pendingLoginRef.current);
      }
    };
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setStatus('idle');
    setMessage('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!formState.email) {
      nextErrors.email = 'Please enter the email associated with your account.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      nextErrors.email = 'Enter a valid email address (for example, name@example.com).';
    }

    if (!formState.password) {
      nextErrors.password = 'Your password is required to continue.';
    } else if (formState.password.length < 8) {
      nextErrors.password = 'Passwords must be at least 8 characters long.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus('idle');
      setMessage('');
      return;
    }

    setErrors({});
    if (pendingLoginRef.current) {
      clearTimeout(pendingLoginRef.current);
    }
    setStatus('loading');
    setMessage('');

    pendingLoginRef.current = setTimeout(() => {
      setStatus('success');
      setMessage(
        `Welcome back, ${formState.email}! ${
          formState.remember
            ? 'You will stay signed in on this device.'
            : 'For added security we will sign you out automatically.'
        }`
      );
      pendingLoginRef.current = null;
    }, 850);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const isLoading = status === 'loading';
  const statusClassName = ['auth-status', status !== 'idle' ? `auth-status--${status}` : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className="authorization-page">
      <section className="auth-card">
        <header className="auth-header">
          <h1>Sign in to your account</h1>
          <p>Enter your credentials below to continue.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit} noValidate aria-busy={isLoading}>
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
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
          </label>
          {errors.email && (
            <p className="auth-error" id="email-error" role="alert">
              {errors.email}
            </p>
          )}

          <label className="auth-label" htmlFor="password">
            Password
            <span className="auth-input-wrapper">
              <input
                className="auth-input"
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formState.password}
                onChange={handleChange}
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                className="auth-toggle"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </span>
          </label>
          {errors.password && (
            <p className="auth-error" id="password-error" role="alert">
              {errors.password}
            </p>
          )}

          <label className="auth-checkbox">
            <input
              type="checkbox"
              name="remember"
              checked={formState.remember}
              onChange={handleChange}
            />
            <span>Keep me signed in</span>
          </label>

          <button className="auth-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing you in…' : 'Sign in'}
          </button>
        </form>

        <div className="auth-divider" role="presentation">
          <span>or continue with</span>
        </div>

        <button className="auth-button secondary" type="button" disabled={isLoading}>
          Continue with SSO
        </button>

        <div className="auth-footer">
          <a className="auth-link" href="#forgot-password">
            Forgot password?
          </a>
          <a className="auth-link" href="#create-account">
            Create account
          </a>
        </div>

        <p className={statusClassName} aria-live="polite" role="status">
          {isLoading ? 'Verifying your credentials…' : message}
        </p>
      </section>
    </div>
  );
}

export default AuthorizationPage;
