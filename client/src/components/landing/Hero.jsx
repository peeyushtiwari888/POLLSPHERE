import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, BarChart3, Users, Zap, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

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
              <button 
                onClick={() => navigate('/signup')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-8 py-4 rounded-full transition-all shadow-[0_8px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_8px_25px_rgba(249,115,22,0.4)] active:scale-95 border border-orange-400/20"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-800 font-bold px-8 py-4 rounded-full transition-all shadow-sm hover:shadow-md active:scale-95">
                <Play className="w-5 h-5 text-orange-500" fill="currentColor" />
                View Demo
              </button>
            </motion.div>
            
            {/* Social Proof */}
            <motion.div variants={fadeUp} className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-950 shadow-sm" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User avatar" />
                ))}
              </div>
              <p>Trusted by <span className="font-bold text-gray-900 dark:text-white">10,000+</span> creators</p>
            </motion.div>
          </motion.div>

          {/* ================= RIGHT SIDE: VISUALS & MOCKUP ================= */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none lg:mt-0 mt-16 perspective-1000">
            
            {/* Animated Background Glowing Orbs */}
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
                rotate: [0, 45, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-tr from-orange-500 to-pink-500 rounded-full blur-[80px] -z-10" 
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
                translateY: [0, -30, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-bl from-blue-500 to-emerald-500 rounded-full blur-[80px] -z-10" 
            />

            {/* Main Dashboard Mockup Window */}
            <motion.div 
              initial={{ opacity: 0, y: 50, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              whileHover={{ scale: 1.02, rotateY: -3, rotateX: 3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative rounded-3xl border border-white/50 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-10"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Window Header */}
              <div className="flex items-center gap-2 px-5 py-4 border-b border-white/50 dark:border-white/5 bg-white/40 dark:bg-black/20 backdrop-blur-md">
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] shadow-inner"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] shadow-inner"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] shadow-inner"></div>
                </div>
                <div className="mx-auto bg-white/80 dark:bg-black/40 rounded-lg px-20 py-1.5 text-[11px] font-mono font-semibold text-gray-500 dark:text-gray-400 border border-white/50 dark:border-white/10 shadow-sm backdrop-blur-sm">
                  pollsphere.com/results
                </div>
              </div>

              {/* Mockup Content */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Product Strategy 2024</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      Live • 1,248 responses
                    </div>
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 text-orange-600 dark:text-orange-400 bg-orange-100/80 dark:bg-orange-500/10 px-4 py-2 rounded-xl text-sm font-bold border border-orange-200/50 dark:border-orange-500/20 shadow-sm"
                  >
                    <Zap className="w-4 h-4 fill-orange-500" /> Active
                  </motion.div>
                </div>

                {/* Mock Bars */}
                <div className="space-y-6">
                  {[
                    { label: "AI Integration", percent: 68, color: "from-orange-500 to-amber-400" },
                    { label: "Mobile App Revamp", percent: 24, color: "from-blue-500 to-cyan-400" },
                    { label: "Performance Tuning", percent: 8, color: "from-emerald-500 to-teal-400" },
                  ].map((bar, i) => (
                    <div key={i} className="relative group">
                      <div className="flex justify-between text-sm font-semibold mb-2">
                        <span className="text-gray-800 dark:text-gray-200 group-hover:text-orange-500 transition-colors">{bar.label}</span>
                        <span className="text-gray-900 dark:text-white font-bold">{bar.percent}%</span>
                      </div>
                      <div className="w-full h-4 bg-gray-200/50 dark:bg-zinc-800/50 rounded-full overflow-hidden shadow-inner backdrop-blur-sm border border-black/5 dark:border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${bar.percent}%` }}
                          transition={{ duration: 1.5, delay: 0.5 + (i * 0.2), ease: "easeOut" }}
                          className={`h-full rounded-full bg-gradient-to-r ${bar.color} relative overflow-hidden`}
                        >
                          <motion.div 
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                          />
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Floating Card 1: Live Users */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -right-8 lg:-right-16 top-16 lg:top-24 z-20 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl p-5 rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgb(0,0,0,0.5)] border border-white/60 dark:border-white/10 flex items-center gap-5"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-500/20 dark:to-blue-500/5 flex items-center justify-center text-blue-500 shadow-inner">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-1">Active Users</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white">842 <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 ml-1 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full shadow-sm">↑ 12%</span></p>
              </div>
            </motion.div>

            {/* Floating Card 2: Responses */}
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
              className="absolute -left-8 lg:-left-16 bottom-16 lg:bottom-24 z-20 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl p-5 rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgb(0,0,0,0.5)] border border-white/60 dark:border-white/10 flex items-center gap-5"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-500/20 dark:to-emerald-500/5 flex items-center justify-center text-emerald-500 shadow-inner">
                <BarChart3 className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-1">New Responses</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white">+1,248</p>
              </div>
            </motion.div>

            {/* Floating Card 3: Status */}
            <motion.div
              animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
              className="absolute right-12 -bottom-8 z-20 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white py-3 px-6 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-zinc-700 flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-bold tracking-wide">Syncing live</span>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
