import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute guards child routes that require authentication.
 *
 * Props:
 *  - children: ReactNode - the protected component or layout
 *
 * Behavior:
 *  - While auth is loading, renders a minimal spinner/skeleton
 *  - If no session, redirects to /login preserving "from"
 *  - Otherwise renders children
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
