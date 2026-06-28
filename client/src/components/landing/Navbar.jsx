import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('');
  
  const navigate = useNavigate();

  // Handle scroll events for navbar styling and active section highlighting
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 10);

      // Determine active section for highlighting
      const sections = ['features', 'how-it-works', 'faq'];
      let current = '';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the section top is above the middle of viewport, it's active
          if (rect.top <= window.innerHeight / 3 && rect.bottom >= window.innerHeight / 3) {
            current = section;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on mount
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80; // offset for fixed navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? 'top-2 sm:top-4 mx-4 md:mx-auto max-w-7xl bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-200/50 dark:border-white/10 py-2 sm:py-3 rounded-2xl'
          : 'top-0 bg-transparent py-5'
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/logo.png" alt="PollSphere Icon" className="h-8 w-auto object-contain rounded-lg shadow-sm" />
            <span className="font-extrabold text-2xl tracking-tighter">
              <span className="text-gray-900 dark:text-white">Poll</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">Sphere</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`relative text-sm font-semibold transition-colors group px-1 py-1 ${
                    isActive 
                      ? 'text-orange-600 dark:text-orange-400' 
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                  <span className={`absolute left-0 -bottom-1 w-full h-[2.5px] bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all origin-left duration-300 ${isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'}`}></span>
                </a>
              );
            })}
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, '#pricing')}
              className={`relative text-sm font-semibold transition-colors group px-1 py-1 ${
                activeSection === 'pricing'
                  ? 'text-orange-600 dark:text-orange-400' 
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
              }`}
            >
              Pricing
              <span className={`absolute left-0 -bottom-1 w-full h-[2.5px] bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all origin-left duration-300 ${activeSection === 'pricing' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'}`}></span>
            </a>
            <div className="flex items-center gap-1.5 cursor-pointer group px-1 py-1">
              <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white transition-colors">What's New</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
            </div>
          </nav>

          {/* Right Action Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="text-sm font-semibold text-gray-900 dark:text-white hover:text-orange-500 transition-colors px-4 py-2"
            >
              Log in
            </button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] border border-orange-400/20"
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Controls (Menu & Theme Toggle) */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-gray-400 p-2 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu with Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className={`text-base font-medium transition-colors ${
                      isActive 
                        ? 'text-orange-500 dark:text-orange-500' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
              <a
                href="#pricing"
                onClick={(e) => scrollToSection(e, '#pricing')}
                className="text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500 transition-colors"
              >
                Pricing
              </a>
              <div 
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-2 cursor-pointer group"
              >
                <span className="group-hover:text-orange-500 transition-colors">What's New</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
              </div>
              
              <div className="pt-4 mt-2 flex flex-col gap-3 border-t border-gray-100 dark:border-zinc-800">
                <button 
                  onClick={() => { setIsOpen(false); navigate('/login'); }}
                  className="w-full text-center text-base font-medium text-gray-900 dark:text-white py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  Log in
                </button>
                <button 
                  onClick={() => { setIsOpen(false); navigate('/signup'); }}
                  className="w-full text-center text-base font-medium bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
