import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Sidebar renders the primary app navigation.
 *
 * Props:
 * - open: boolean - indicates if the sidebar is open on mobile
 * - onNavigate: function - called when a nav link is clicked (to close sidebar on mobile)
 */
export default function Sidebar({ open, onNavigate }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} role="navigation" aria-label="Sidebar">
      <nav className="nav-list">
        <NavLink to="/dashboard" className="nav-link" onClick={onNavigate}>
          <span className="icon" aria-hidden>🏠</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/settings" className="nav-link" onClick={onNavigate}>
          <span className="icon" aria-hidden>⚙️</span>
          <span>Settings</span>
        </NavLink>
        <NavLink to="/publish" className="nav-link" onClick={onNavigate}>
          <span className="icon" aria-hidden>🚀</span>
          <span>Publish</span>
        </NavLink>
      </nav>
    </aside>
  );
}
