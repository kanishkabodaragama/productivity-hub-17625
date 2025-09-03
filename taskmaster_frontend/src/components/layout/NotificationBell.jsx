/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState } from 'react';
import notificationsService from '../../lib/notificationsService';

/**
 * PUBLIC_INTERFACE
 * NotificationBell shows an icon with unread badge and toggles a notifications panel.
 *
 * Props:
 * - onToggle(open: boolean): optional callback when the panel open state changes
 * - openExternal?: boolean - if provided, controls the open state externally
 * - setOpenExternal?: (boolean) => void - setter for external control
 */
export default function NotificationBell({ onToggle, openExternal, setOpenExternal }) {
  const [state, setState] = useState(notificationsService.getState());
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);

  // subscribe to service
  useEffect(() => {
    const unsub = notificationsService.subscribe(setState);
    return unsub;
  }, []);

  // handle external control if provided
  const isOpen = typeof openExternal === 'boolean' ? openExternal : open;
  const setIsOpen = typeof setOpenExternal === 'function' ? setOpenExternal : setOpen;

  const toggle = () => {
    setIsOpen(!isOpen);
    onToggle && onToggle(!isOpen);
  };

  // close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (!btnRef.current) return;
      if (btnRef.current.contains(e.target)) return;
      // if click inside dropdown container, ignore (handled by parent)
      const dropdown = document.getElementById('notifications-dropdown');
      if (dropdown && dropdown.contains(e.target)) return;
      setIsOpen(false);
      onToggle && onToggle(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onToggle, setIsOpen]);

  const unread = state.unread || 0;

  return (
    <div className="notif-bell">
      <button
        ref={btnRef}
        className="notif-btn"
        aria-haspopup="dialog"
        aria-controls="notifications-dropdown"
        aria-expanded={isOpen}
        aria-label={state.unread > 0 ? `Notifications, ${state.unread} unread` : 'Notifications'}
        onClick={toggle}
        role="button"
      >
        <span className="bell-icon" aria-hidden>🔔</span>
        {unread > 0 ? <span className="badge" aria-live="polite" aria-atomic="true" aria-label={`${unread} unread notifications`}>{unread}</span> : null}
      </button>
    </div>
  );
}
