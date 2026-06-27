import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, BarChart3, Users, Zap, CheckCircle2 } from 'lucide-react';

const Hero = () => {
  // Animation variants for staggered entrance
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white dark:bg-zinc-950">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/10 dark:bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* ================= LEFT SIDE: CONTENT ================= */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-medium mb-6">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              PollSphere v1.0 is live
            </motion.div>

            {/* Heading */}
            <motion.div variants={fadeUp}>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]">
                Real-time polling for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">modern teams</span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p variants={fadeUp} className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
              Create, share, and analyze beautiful polls in seconds. Engage your audience with interactive voting and live analytics that update instantly.
            </motion.p>

            {/* Actions */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3.5 rounded-full transition-all shadow-lg hover:shadow-orange-500/25 active:scale-95">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-800 font-medium px-8 py-3.5 rounded-full transition-all shadow-sm active:scale-95">
                <Play className="w-4 h-4 text-orange-500" fill="currentColor" />
                View Demo
              </button>
            </motion.div>
            
            {/* Social Proof */}
            <motion.div variants={fadeUp} className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-950" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User avatar" />
                ))}
              </div>
              <p>Trusted by 10,000+ creators</p>
            </motion.div>
          </motion.div>

          {/* ================= RIGHT SIDE: VISUALS & MOCKUP ================= */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none lg:mt-0 mt-12">
            
            {/* Main Dashboard Mockup Window */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative rounded-2xl border border-gray-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl overflow-hidden z-10"
            >
              {/* Window Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-zinc-800/50 bg-gray-50/50 dark:bg-zinc-950/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="mx-auto bg-white dark:bg-zinc-800 rounded-md px-24 py-1 text-[10px] text-gray-400 border border-gray-100 dark:border-zinc-700">pollsphere.com/results</div>
              </div>

              {/* Mockup Content */}
              <div className="p-6">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Product Strategy 2024</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Live • 1,248 responses</p>
                  </div>
                  <div className="flex items-center gap-2 text-orange-500 bg-orange-50 dark:bg-orange-500/10 px-3 py-1.5 rounded-full text-sm font-medium">
                    <Zap className="w-4 h-4" /> Live
                  </div>
                </div>

                {/* Mock Bars */}
                <div className="space-y-4">
                  {[
                    { label: "AI Integration", percent: 68, color: "bg-orange-500" },
                    { label: "Mobile App Revamp", percent: 24, color: "bg-gray-200 dark:bg-zinc-700" },
                    { label: "Performance Tuning", percent: 8, color: "bg-gray-100 dark:bg-zinc-800" },
                  ].map((bar, i) => (
                    <div key={i} className="relative">
                      <div className="flex justify-between text-sm font-medium mb-1.5">
                        <span className="text-gray-700 dark:text-gray-300">{bar.label}</span>
                        <span className="text-gray-900 dark:text-white">{bar.percent}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${bar.percent}%` }}
                          transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                          className={`h-full rounded-full ${bar.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Floating Card 1: Live Users */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-6 lg:-right-12 top-10 lg:top-20 z-20 bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-700 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Active Users</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">842 <span className="text-xs text-green-500 ml-1">↑ 12%</span></p>
              </div>
            </motion.div>

            {/* Floating Card 2: Responses */}
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -left-6 lg:-left-12 bottom-10 lg:bottom-20 z-20 bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-700 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">New Responses</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">+1,248</p>
              </div>
            </motion.div>

            {/* Floating Card 3: Status */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute right-10 -bottom-6 z-20 bg-white dark:bg-zinc-800 py-2 px-4 rounded-full shadow-lg border border-gray-100 dark:border-zinc-700 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Syncing live</span>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
