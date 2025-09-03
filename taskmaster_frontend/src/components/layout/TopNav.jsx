import React from 'react';

/**
 * PUBLIC_INTERFACE
 * TopNav renders the top navigation bar with brand and a hamburger menu for mobile.
 *
 * Props:
 * - onMenuClick: function to toggle the sidebar on small screens
 */
export default function TopNav({ onMenuClick }) {
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
      <div className="topnav-actions">
        {/* Placeholder for future actions: notifications, profile, theme */}
      </div>
    </header>
  );
}
