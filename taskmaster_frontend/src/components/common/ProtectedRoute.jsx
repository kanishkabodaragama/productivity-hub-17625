import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute guards child routes that require authentication.
 * For now, it uses a simple localStorage token check ("tm_auth").
 * Replace with real auth integration (e.g., Supabase) later.
 *
 * Props:
 *  - children: ReactNode - the protected component or layout
 *
 * Returns the children if authenticated, otherwise redirects to /login with a from state.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const isAuthed = Boolean(localStorage.getItem('tm_auth')); // TODO: integrate Supabase session

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
