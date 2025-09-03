# TaskMaster Frontend

This is the TaskMaster React frontend.

Build notes:
- If you see a Browserslist warning during build like:
  "Browserslist: browsers data (caniuse-lite) is 7 months old..."
  This is informational and does not break the build. To update locally (optional):
    npx update-browserslist-db@latest
  For CI environments without network access or update permissions, this warning can be ignored.
- In this repo’s CI, this message may appear during optimized builds and is safe to ignore; it does not indicate a failure.
- Tip: You can also run the included script to refresh browserslist data locally:
    npm run browserslist:update

Features implemented:
- Authentication (Supabase)
- Protected routes
- Dashboard with charts
- Realtime Notifications (Supabase Realtime channel with mock fallback)
- NotificationBell + NotificationsPanel integrated into TopNav
- Settings page with Profile and Preferences (Supabase metadata + theme persistence)
- Publishable personal website:
  - Preview your profile on /publish using the PreviewCard component.
  - Publish to Supabase table "public_profiles" (mock fallback with localStorage when Supabase is not configured).
  - Public profiles are accessible at /u/:slug with graceful sample-data fallback.
  - See assets/supabase.md for table schema, RLS guidance, and environment variables.
