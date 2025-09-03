import React from 'react';
import notificationsService from '../../lib/notificationsService';

/**
 * PUBLIC_INTERFACE
 * NotificationsPanel renders a dropdown panel listing recent notifications.
 *
 * Props:
 * - open: boolean - controls visibility
 * - onClose: function - called when panel should close
 */
export default function NotificationsPanel({ open, onClose }) {
  const [state, setState] = React.useState(notificationsService.getState());

  React.useEffect(() => {
    const unsub = notificationsService.subscribe(setState);
    return unsub;
  }, []);

  const items = state.items || [];

  const handleMarkAll = () => notificationsService.markAllRead();
  const handleMarkRead = (id) => notificationsService.markRead(id);

  return (
    <div
      id="notifications-dropdown"
      className={`notif-panel ${open ? 'open' : ''}`}
      role="dialog"
      aria-label="Notifications"
      aria-hidden={!open}
    >
      <div className="notif-header">
        <div>
          <strong>Notifications</strong>
          <span className="muted" style={{ marginLeft: 8, fontSize: '.85rem' }}>
            {state.connected ? (state.usingMock ? 'Demo stream' : 'Live') : 'Offline'}
          </span>
        </div>
        <button className="btn ghost small" onClick={handleMarkAll} aria-label="Mark all as read">
          Mark all read
        </button>
      </div>

      <div className="notif-list" role="list">
        {items.length === 0 ? (
          <div className="empty muted">No notifications yet</div>
        ) : (
          items.map((n) => (
            <div
              key={n.id}
              role="listitem"
              className={`notif-item ${n.read ? 'read' : 'unread'} ${n.type || 'info'}`}
              onClick={() => handleMarkRead(n.id)}
              onKeyDown={(e) => e.key === 'Enter' && handleMarkRead(n.id)}
              tabIndex={0}
              aria-label={`${n.title}. ${n.body}`}
            >
              <div className="dot" />
              <div className="content">
                <div className="title-row">
                  <span className="title">{n.title}</span>
                  <span className="time muted">{formatTime(n.ts)}</span>
                </div>
                {n.body ? <div className="body">{n.body}</div> : null}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="notif-footer">
        <button className="btn" onClick={onClose} aria-label="Close notifications">Close</button>
      </div>
    </div>
  );
}

function formatTime(ts) {
  try {
    const d = new Date(ts);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
  } catch (_e) {
    return '';
  }
}
