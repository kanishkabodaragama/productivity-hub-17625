import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import Settings from '../pages/Settings';
import Publish from '../pages/Publish';
import PublicProfile from '../pages/PublicProfile';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';

/**
 * PUBLIC_INTERFACE
 * AppRoutes configures all top-level routes for the TaskMaster web app using React Router v6.
 * Routes:
 *  - Public: Landing (/), Login (/login), Register (/register), Reset Password (/reset-password), Public profile (/u/:slug)
 *  - Protected (requires auth): Dashboard (/dashboard), Settings (/settings), Publish (/publish)
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/u/:slug" element={<PublicProfile />} />

      {/* Protected pages wrapped in MainLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="settings" element={<Settings />} />
        <Route path="publish" element={<Publish />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
