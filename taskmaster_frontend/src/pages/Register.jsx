import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Register page: Supabase sign-up with email confirmation and inline feedback.
 */
export default function Register() {
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    const { error, data } = await signUp({
      email: email.trim(),
      password,
      metadata: { name: name.trim() },
    });
    if (error) {
      setErrorMsg(error.message || 'Failed to create account.');
      return;
    }
    // If email confirmation is enabled, Supabase returns user as null and sends email
    if (!data?.user) {
      setInfoMsg('Check your inbox to confirm your email before signing in.');
    } else {
      setInfoMsg('Account created! Redirecting to sign in…');
    }
    setTimeout(() => {
      navigate('/login', {
        replace: true,
        state: { prefillEmail: email, message: 'Account created. Please sign in.' },
      });
    }, 1200);
  };

  return (
    <div className="container auth" style={{ maxWidth: 480 }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <div className="brand-mark" style={{ margin: '0 auto' }}>TM</div>
      </div>
      <h2 className="title" style={{ textAlign: 'center' }}>Create your account</h2>
      <p className="subtitle" style={{ textAlign: 'center' }}>
        Start organizing tasks and publishing your productivity site.
      </p>

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
          Name
          <input type="text" required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="form-label">
          Email
          <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="form-label">
          Password
          <input type="password" required placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button className="btn primary full" type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>

      <div className="form-footer" style={{ textAlign: 'center' }}>
        <span>Already have an account? </span>
        <Link to="/login" style={{ color: 'var(--primary)' }}>Sign in</Link>
      </div>
    </div>
  );
}
