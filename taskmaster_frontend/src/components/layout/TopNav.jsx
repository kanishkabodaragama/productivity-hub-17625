import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';
import NotificationsPanel from './NotificationsPanel';

/**
 * PUBLIC_INTERFACE
 * TopNav renders the top navigation bar with brand, notifications, and user actions.
 *
 * Props:
 * - onMenuClick: function to toggle the sidebar on small screens
 */
export default function TopNav({ onMenuClick }) {
  const { user, signOut } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);

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

      <div className="topnav-actions" style={{ marginLeft: 'auto', display: 'flex', gap: '.5rem', alignItems: 'center', position: 'relative' }}>
        <NotificationBell openExternal={notifOpen} setOpenExternal={setNotifOpen} />
        <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
        {user ? (
          <>
            <span className="muted hide-sm" style={{ fontSize: '.9rem' }}>{user.email}</span>
            <button className="btn" onClick={signOut} aria-label="Sign out">Sign out</button>
          </>
        ) : null}
      </div>
    </header>
  );
}
