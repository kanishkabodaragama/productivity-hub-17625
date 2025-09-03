import { getSupabaseClient } from './supabaseClient';

/**
 * PUBLIC_INTERFACE
 * NotificationsService provides a simple pub-sub for in-app notifications.
 * It attempts to connect to Supabase Realtime on a "notifications" channel (broadcast),
 * and falls back to a local timer-based mock stream if Supabase is not configured.
 *
 * Exported API:
 * - subscribe(handler): function to receive notification arrays when state updates
 * - markAllRead(): mark all notifications as read
 * - markRead(id): mark a specific notification as read
 * - getState(): get current notification state
 * - start(): start realtime or mock stream (called automatically on first import)
 * - stop(): cleanup subscriptions
 */
class NotificationsService {
  constructor() {
    this.supabase = null;
    this.channel = null;
    this.handlers = new Set();
    this.state = {
      items: [],
      unread: 0,
      connected: false,
      usingMock: false,
    };
    this._mockTimer = null;
    this._started = false;
  }

  _emit() {
    const snapshot = { ...this.state, items: [...this.state.items] };
    this.handlers.forEach((h) => h(snapshot));
  }

  _update(fn) {
    this.state = fn(this.state);
    // recalc unread
    const unread = this.state.items.filter((n) => !n.read).length;
    this.state.unread = unread;
    this._emit();
  }

  getState() {
    return { ...this.state, items: [...this.state.items] };
  }

  // PUBLIC_INTERFACE
  subscribe(handler) {
    /** Subscribe to notification state changes. Returns an unsubscribe function. */
    this.handlers.add(handler);
    // initial push
    handler(this.getState());
    return () => {
      this.handlers.delete(handler);
    };
  }

  // PUBLIC_INTERFACE
  markAllRead() {
    /** Mark all current notifications as read. */
    this._update((s) => ({
      ...s,
      items: s.items.map((n) => ({ ...n, read: true })),
    }));
  }

  // PUBLIC_INTERFACE
  markRead(id) {
    /** Mark a specific notification as read by id. */
    this._update((s) => ({
      ...s,
      items: s.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }

  _addNotification(n) {
    this._update((s) => {
      const items = [n, ...s.items].slice(0, 50); // keep last 50
      return { ...s, items };
    });
  }

  _startMock() {
    this.state.connected = true;
    this.state.usingMock = true;
    this._emit();

    // Seed a few
    const seed = [
      {
        id: 'seed-1',
        title: 'Welcome to TaskMaster',
        body: 'You’ll receive updates here in real-time.',
        type: 'info',
        ts: Date.now() - 1000 * 60 * 5,
        read: false,
      },
      {
        id: 'seed-2',
        title: 'First steps',
        body: 'Create a task or explore your dashboard.',
        type: 'success',
        ts: Date.now() - 1000 * 60 * 30,
        read: true,
      },
    ];
    seed.forEach((n) => this._addNotification(n));

    // Periodic mock messages
    const samples = [
      { title: 'Task completed', body: '“Refactor auth context” is done.', type: 'success' },
      { title: 'New task assigned', body: '“Prepare sprint notes” assigned to you.', type: 'info' },
      { title: 'Upcoming deadline', body: '“Marketing draft” due tomorrow.', type: 'warning' },
    ];
    this._mockTimer = setInterval(() => {
      const pick = samples[Math.floor(Math.random() * samples.length)];
      this._addNotification({
        id: `mock-${Date.now()}`,
        title: pick.title,
        body: pick.body,
        type: pick.type,
        ts: Date.now(),
        read: false,
      });
    }, 15000);
  }

  async _startRealtime() {
    try {
      this.supabase = getSupabaseClient();
    } catch (e) {
      // Supabase not configured; fallback to mock
      this._startMock();
      return;
    }

    try {
      const channel = this.supabase.channel('notifications');
      this.channel = channel;

      // We use broadcast for generic notifications demo
      channel.on('broadcast', { event: 'new_notification' }, (payload) => {
        const data = payload?.payload || payload; // supabase sends {payload: {...}}
        if (data && data.title) {
          this._addNotification({
            id: data.id || `rt-${Date.now()}`,
            title: data.title,
            body: data.body || '',
            type: data.type || 'info',
            ts: data.ts || Date.now(),
            read: false,
          });
        }
      });

      await channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          this.state.connected = true;
          this.state.usingMock = false;
          this._emit();
        }
      });
    } catch (_e) {
      // Realtime failed, fallback to mock
      this._startMock();
    }
  }

  // PUBLIC_INTERFACE
  start() {
    /** Initialize realtime or mock stream. Safe to call multiple times. */
    if (this._started) return;
    this._started = true;
    this._startRealtime();
  }

  // PUBLIC_INTERFACE
  stop() {
    /** Cleanup subscriptions and timers. */
    if (this.channel) {
      try {
        this.channel.unsubscribe();
      } catch (_e) {}
      this.channel = null;
    }
    if (this._mockTimer) {
      clearInterval(this._mockTimer);
      this._mockTimer = null;
    }
    this._started = false;
    this.state.connected = false;
    this._emit();
  }
}

const svc = new NotificationsService();
svc.start();

export default svc;
