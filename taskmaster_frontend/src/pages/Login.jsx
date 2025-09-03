import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Login page: basic form that sets a demo auth token and redirects.
 * Replace with real Supabase auth later.
 */
export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Demo-only mock auth
    localStorage.setItem('tm_auth', 'demo');
    const to = state?.from?.pathname || '/dashboard';
    setTimeout(() => {
      navigate(to, { replace: true });
    }, 300);
  };

  return (
    <div className="container auth">
      <h2 className="title">Sign in</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form-label">
          Email
          <input type="email" required placeholder="you@example.com" />
        </label>
        <label className="form-label">
          Password
          <input type="password" required placeholder="••••••••" />
        </label>
        <button className="btn primary full" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <div className="form-footer">
        <Link to="/reset-password">Forgot password?</Link>
        <span> · </span>
        <Link to="/register">Create account</Link>
      </div>
    </div>
  );
}
