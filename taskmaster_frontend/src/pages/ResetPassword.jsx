import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * ResetPassword page: basic form that simulates sending reset email.
 * Replace with real Supabase reset flow later.
 */
export default function ResetPassword() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="container auth">
      <h2 className="title">Reset password</h2>
      {!sent ? (
        <form className="form" onSubmit={handleSubmit}>
          <label className="form-label">
            Email
            <input type="email" required placeholder="you@example.com" />
          </label>
          <button className="btn primary full" type="submit">Send reset link</button>
        </form>
      ) : (
        <p className="success">If an account exists, a reset link has been sent.</p>
      )}
      <div className="form-footer">
        <Link to="/login">Back to sign in</Link>
      </div>
    </div>
  );
}
