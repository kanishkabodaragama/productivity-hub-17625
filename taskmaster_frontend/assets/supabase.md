# Supabase Integration Guide

This frontend uses Supabase for authentication, realtime notifications, and optional public profile publishing.

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
- Public profile publishing:
  - src/pages/Publish.jsx provides a preview + publish UI.
  - src/lib/publishService.js upserts to table "public_profiles" (or falls back to localStorage mock).
  - Public route is available at /u/:slug and reads from "public_profiles" (or sample fallback).

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

Public Profiles (Database)
- Create table public_profiles with at least the following columns:
  - slug: text PRIMARY KEY (unique)
  - user_id: uuid NULL
  - name: text NOT NULL
  - title: text NULL
  - bio: text NULL
  - avatar_url: text NULL
  - tasksCompleted: int4 NULL
  - activeProjects: int4 NULL
  - focusScore: int4 NULL
  - links: jsonb NULL
  - updated_at: timestamptz NOT NULL DEFAULT now()
- Ensure RLS allows anonymous read (SELECT) for published profiles:
  Example simple policy (adjust to your needs):
    - Enable RLS on public_profiles
    - Policy: "Read public profiles"
      USING (true)  FOR SELECT
    - Policy: "Upsert own profiles" for authenticated users (optional) with checks on user_id = auth.uid()
- If RLS is enabled, configure policies to match your security requirements.

Mock fallback behavior:
- If REACT_APP_SUPABASE_URL or REACT_APP_SUPABASE_KEY are missing, publishing and fetching profiles fall back to localStorage under key "tm_public_profiles".
- The public route /u/:slug will show the mock data when present, or a sample profile otherwise.

Troubleshooting:
- If you see "Supabase configuration error: Missing environment variable(s)" in console, ensure env variables are set and rebuild the app.
- For password reset and email confirmation links, ensure your Supabase project's Auth "Site URL" allows the domain you use here.
- If no realtime messages arrive, ensure Realtime is enabled in your Supabase project and the anonymous key has Realtime access.
- For public profiles, verify the "public_profiles" table exists and RLS policies allow the intended access (anonymous read, authenticated upsert).
