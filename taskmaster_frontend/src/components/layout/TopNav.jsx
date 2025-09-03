import React from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * TopNav renders the top navigation bar with brand and a hamburger menu for mobile.
 *
 * Props:
 * - onMenuClick: function to toggle the sidebar on small screens
 */
export default function TopNav({ onMenuClick }) {
  const { user, signOut } = useAuth();

  return (
    <header className="topnav" role="banner">
      <button
        className="menu-btn"
        onClick={onMenuClick}
        aria-label="Toggle navigation menu"
      >
        ☰
      </button>
      <div className="brand">
        <span className="brand-mark">TM</span>
        <span className="brand-name">TaskMaster</span>
      </div>
      <div className="topnav-actions" style={{ marginLeft: 'auto', display: 'flex', gap: '.5rem', alignItems: 'center' }}>
        {user ? (
          <>
            <span className="muted" style={{ fontSize: '.9rem' }}>{user.email}</span>
            <button className="btn" onClick={signOut} aria-label="Sign out">Sign out</button>
          </>
        ) : null}
      </div>
    </header>
  );
}
