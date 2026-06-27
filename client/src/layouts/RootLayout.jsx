import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * RootLayout
 * 
 * This is the master wrapper for public-facing pages.
 * It ensures that the Navbar and Footer are consistently displayed,
 * while the page content is dynamically injected into the <Outlet />.
 */
const RootLayout = () => {
  return (
    // min-h-screen and flex-col ensure the footer always sticks to the bottom if content is short
    <div className="flex flex-col min-h-screen bg-[rgb(var(--bg-background))] transition-colors duration-300">
      
      {/* Navbar Placeholder */}
      <header className="h-16 border-b border-[rgb(var(--border))] flex items-center px-4 md:px-8 shrink-0">
        <div className="text-xl font-bold gradient-text">Navbar Placeholder</div>
      </header>

      {/* Main Content Area */}
      {/* flex-grow pushes the footer to the bottom */}
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>

      {/* Footer Placeholder */}
      <footer className="py-6 border-t border-[rgb(var(--border))] flex items-center justify-center shrink-0">
        <p className="text-[rgb(var(--text-secondary))] text-sm">
          Footer Placeholder &copy; {new Date().getFullYear()}
        </p>
      </footer>
      
    </div>
  );
};

export default RootLayout;
