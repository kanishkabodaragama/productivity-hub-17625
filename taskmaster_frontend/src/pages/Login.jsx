import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './auth-context-alias';

/**
 * PUBLIC_INTERFACE
 * Login page: Email/password sign-in via Supabase with inline errors and success feedback.
 */
export default function Login() {
  const { signIn, loading } = useAuth();
  const { state } = useLocation();
  const [email, setEmail] = useState(state?.prefillEmail || '');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState(state?.message || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    const { error } = await signIn(email.trim(), password);
    if (error) {
      setErrorMsg(error.message || 'Failed to sign in. Please try again.');
    } else {
      setInfoMsg('Signed in successfully. Redirecting…');
    }
  };

  return (
    <div className="container auth" style={{ maxWidth: 420 }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <div className="brand-mark" style={{ margin: '0 auto' }}>TM</div>
      </div>
      <h2 className="title" style={{ textAlign: 'center' }}>Welcome back</h2>
      <p className="subtitle" style={{ textAlign: 'center' }}>Sign in to continue to your dashboard</p>

      {errorMsg ? (
        <div role="alert" style={{ background: 'rgba(246, 173, 85, .15)', border: '1px solid #F6AD55', color: '#744210', padding: '.75rem', borderRadius: '.5rem', marginTop: '.75rem' }}>
          {errorMsg}
        </div>
      ) : null}
      {infoMsg ? (
        <div role="status" style={{ background: 'rgba(79, 209, 197, .15)', border: '1px solid #4FD1C5', color: '#065666', padding: '.75rem', borderRadius: '.5rem', marginTop: '.75rem' }}>
          {infoMsg}
        </div>
      ) : null}

      <form className="form" onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <label className="form-label">
          Email
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
          />
        </label>
        <label className="form-label">
          Password
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
          />
        </label>
        <button className="btn primary full" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="form-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/reset-password" style={{ color: 'var(--secondary)' }}>Forgot password?</Link>
        <Link to="/register" style={{ color: 'var(--primary)' }}>Create account</Link>
      </div>
    </div>
  );
}
