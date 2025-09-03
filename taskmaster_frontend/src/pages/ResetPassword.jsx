import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * ResetPassword page: Sends a Supabase password reset email with user feedback.
 */
export default function ResetPassword() {
  const { requestPasswordReset, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const { error } = await requestPasswordReset(email.trim());
    if (error) {
      setErrorMsg(error.message || 'Unable to send reset link. Please try again.');
      return;
    }
    setSent(true);
  };

  return (
    <div className="container auth" style={{ maxWidth: 420 }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <div className="brand-mark" style={{ margin: '0 auto' }}>TM</div>
      </div>
      <h2 className="title" style={{ textAlign: 'center' }}>Reset password</h2>
      <p className="subtitle" style={{ textAlign: 'center' }}>
        Enter your email and we'll send you a link to reset your password.
      </p>

      {errorMsg ? (
        <div role="alert" style={{ background: 'rgba(246, 173, 85, .15)', border: '1px solid #F6AD55', color: '#744210', padding: '.75rem', borderRadius: '.5rem', marginTop: '.75rem' }}>
          {errorMsg}
        </div>
      ) : null}

      {!sent ? (
        <form className="form" onSubmit={handleSubmit}>
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
          <button className="btn primary full" type="submit" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      ) : (
        <div role="status" className="success" style={{ background: 'rgba(79, 209, 197, .15)', border: '1px solid #4FD1C5', color: '#065666', padding: '.75rem', borderRadius: '.5rem', marginTop: '.75rem' }}>
          If an account exists, a reset link has been sent. Please check your inbox.
        </div>
      )}

      <div className="form-footer" style={{ textAlign: 'center' }}>
        <Link to="/login" style={{ color: 'var(--primary)' }}>Back to sign in</Link>
      </div>
    </div>
  );
}
