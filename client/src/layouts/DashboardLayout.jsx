import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * DashboardLayout
 * 
 * A specialized layout for logged-in users. It features a responsive sidebar 
 * and a top navigation bar, creating a true SaaS application feel.
 */
const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex bg-[rgb(var(--bg-background))] transition-colors duration-300">
      
      {/* 
        Sidebar Placeholder 
        Hidden on smaller screens (mobile), takes a fixed 16rem (64 units) width on desktop.
      */}
      <aside className="hidden md:flex w-64 flex-col border-r border-[rgb(var(--border))] shrink-0 bg-[rgb(var(--bg-surface))]">
        <div className="h-16 flex items-center px-6 border-b border-[rgb(var(--border))]">
          <span className="text-xl font-bold gradient-text">PollSphere</span>
        </div>
        <div className="flex-1 p-6">
          <p className="text-sm font-medium text-[rgb(var(--text-secondary))]">Sidebar Placeholder</p>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar Placeholder */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-[rgb(var(--border))] shrink-0 bg-[rgb(var(--bg-background))]">
          <p className="text-sm font-medium text-[rgb(var(--text-secondary))] md:hidden">Mobile Header Placeholder</p>
          <p className="text-sm font-medium text-[rgb(var(--text-secondary))] hidden md:block">Topbar Placeholder</p>
        </header>

        {/* 
          Dashboard Content Area 
          The overflow-y-auto ensures that if the page gets too long, 
          only this section scrolls while the sidebar and topbar stay fixed.
        */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
        
      </div>

    </div>
  );
};

export default DashboardLayout;
