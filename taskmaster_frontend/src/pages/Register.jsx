import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Register page: basic form that sets a demo auth token and redirects.
 * Replace with real Supabase auth later.
 */
export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem('tm_auth', 'demo');
    setTimeout(() => navigate('/dashboard', { replace: true }), 300);
  };

  return (
    <div className="container auth">
      <h2 className="title">Create your account</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form-label">
          Name
          <input type="text" required placeholder="Your name" />
        </label>
        <label className="form-label">
          Email
          <input type="email" required placeholder="you@example.com" />
        </label>
        <label className="form-label">
          Password
          <input type="password" required placeholder="••••••••" />
        </label>
        <button className="btn primary full" type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <div className="form-footer">
        <span>Already have an account? </span>
        <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
}
