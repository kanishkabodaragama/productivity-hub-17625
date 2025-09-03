# Supabase Integration Guide

This frontend uses Supabase for authentication.

Required environment variables (set these in .env at the project root for the frontend):
- REACT_APP_SUPABASE_URL=<your_supabase_project_url>
- REACT_APP_SUPABASE_KEY=<your_supabase_anon_public_key>
- REACT_APP_SITE_URL=<your_site_url_for_email_redirects>  # optional, defaults to window.location.origin

Usage:
- AuthProvider in src/context/AuthContext.jsx initializes and watches Supabase session state.
- ProtectedRoute consumes AuthContext to guard routes.
- Login/Register/ResetPassword pages call AuthContext actions to sign in/up/reset.

Email redirect configuration:
- Sign up and password reset flows set email redirect to REACT_APP_SITE_URL if provided, otherwise window.location.origin.

Troubleshooting:
- If you see "Supabase configuration error: Missing environment variable(s)" in console, ensure env variables are set and rebuild the app.
- For password reset and email confirmation links, ensure your Supabase project's Auth "Site URL" allows the domain you use here.
