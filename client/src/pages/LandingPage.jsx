import React, { useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import BuiltWith from '../components/landing/BuiltWith';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import LivePreview from '../components/landing/LivePreview';
import FAQ from '../components/landing/FAQ';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  // Ensure the page loads at the very top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans text-gray-900 dark:text-gray-100 selection:bg-orange-500/30 dark:selection:bg-orange-500/50">
      
      {/* Sticky Navigation */}
      <Navbar />
      
      {/* Main Page Content */}
      <main className="w-full flex flex-col">
        <Hero />
        <BuiltWith />
        <Features />
        <HowItWorks />
        <LivePreview />
        <FAQ />
        <CTA />
      </main>
      
      {/* Footer */}
      <Footer />
      
    </div>
  );
};

export default LandingPage;
