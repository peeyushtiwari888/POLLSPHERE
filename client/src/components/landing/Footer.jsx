import React, { useState } from 'react';
import { Code, MessageCircle, Globe, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const currentYear = new Date().getFullYear();

  const links = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'How It Works', href: '#how-it-works' },
      { name: 'Pricing', href: '#' },
      { name: 'Changelog', href: '#' },
    ],
    resources: [
      { name: 'Documentation', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Help Center', href: '#' },
      { name: 'Community', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
    ]
  };

  return (
    <footer className="bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-zinc-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Links & Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          
          {/* Logo & Tagline (Spans 2 cols on lg screens) */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl leading-none">P</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                PollSphere
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs leading-relaxed">
              The modern platform for creating engaging polls, collecting real-time feedback, and analyzing results instantly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-500 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-500 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-500 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200 dark:bg-zinc-800 mb-8" />

        {/* Bottom Section: Copyright, Socials & Theme Toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} PollSphere Inc. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-zinc-900 rounded-full border border-gray-200 dark:border-zinc-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <div className="w-px h-6 bg-gray-200 dark:bg-zinc-800 mx-2" />

            {/* Social Icons */}
            <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="Twitter">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="GitHub">
              <Code className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="LinkedIn">
              <Globe className="w-5 h-5" />
            </a>

          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
