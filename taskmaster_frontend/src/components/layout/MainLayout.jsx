import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import Sidebar from './Sidebar';

/**
 * PUBLIC_INTERFACE
 * MainLayout composes the authenticated layout:
 * - TopNav at the top with brand and user actions
 * - Sidebar on the left with navigation
 * - Main content area that renders nested routes via Outlet
 */
export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((v) => !v);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={`layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <TopNav onMenuClick={toggleSidebar} />
      <div className="layout-body">
        <Sidebar open={sidebarOpen} onNavigate={closeSidebar} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
