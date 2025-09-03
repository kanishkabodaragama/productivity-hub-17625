# Supabase Integration Guide

This frontend uses Supabase for authentication and realtime notifications.

Required environment variables (set these in .env at the project root for the frontend):
- REACT_APP_SUPABASE_URL=<your_supabase_project_url>
- REACT_APP_SUPABASE_KEY=<your_supabase_anon_public_key>
- REACT_APP_SITE_URL=<your_site_url_for_email_redirects>  # optional, defaults to window.location.origin

Usage:
- AuthProvider in src/context/AuthContext.jsx initializes and watches Supabase session state.
- ProtectedRoute consumes AuthContext to guard routes.
- Login/Register/ResetPassword pages call AuthContext actions to sign in/up/reset.
- Notifications:
  - src/lib/notificationsService.js connects to a Supabase Realtime channel named "notifications".
  - If Supabase is not configured, it falls back to a mock timer that generates demo notifications.
  - UI components:
    - NotificationBell (badge + trigger)
    - NotificationsPanel (dropdown with list and actions)

Realtime notifications:
- This app listens for broadcast events on channel "notifications" with event type "new_notification".
- Example payload:
  {
    "id": "custom-id",             // optional
    "title": "Task completed",
    "body": "“Refactor auth context” is done.",
    "type": "success",             // info | success | warning
    "ts": 1710000000000            // optional timestamp (ms)
  }

Publishing a notification from client code:
const supabase = getSupabaseClient();
await supabase.channel('notifications')
  .send({
    type: 'broadcast',
    event: 'new_notification',
    payload: { title: 'Hello', body: 'From client', type: 'info' }
  });

Troubleshooting:
- If you see "Supabase configuration error: Missing environment variable(s)" in console, ensure env variables are set and rebuild the app.
- For password reset and email confirmation links, ensure your Supabase project's Auth "Site URL" allows the domain you use here.
- If no realtime messages arrive, ensure Realtime is enabled in your Supabase project and the anonymous key has Realtime access.
