import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import TopNavbar from '../components/dashboard/TopNavbar';

/**
 * ============================================================================
 * MAIN DASHBOARD LAYOUT
 * Orchestrates the Sidebar, TopNavbar, and the Outlet for page content.
 * ============================================================================
 */
const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop state

  // Lock body scroll when mobile sidebar is open to prevent background scrolling
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 font-sans transition-colors duration-300">
      
      {/* Sidebar Navigation Container */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Wrapper */}
      {/* Dynamic left margin based on the desktop sidebar state */}
      <div 
        className={`
          flex flex-col min-h-screen transition-all duration-300 ease-in-out
          lg:${isSidebarCollapsed ? 'ml-20' : 'ml-64'}
        `}
      >
        {/* Sticky Top Navigation */}
        <TopNavbar onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          
          {/* 
            React Router Outlet 
            This is where the actual dashboard pages (Overview, Analytics, Create Poll) 
            will be injected by the AppRouter.
            
            We wrap it in a motion.div to give every page transition a premium SaaS fade-up effect.
          */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
          
        </main>
      </div>
      
    </div>
  );
};

export default DashboardLayout;
