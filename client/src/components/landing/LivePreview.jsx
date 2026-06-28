import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LivePreview = () => {
  // Animated states to simulate "live" updates
  const [votes, setVotes] = useState({ A: 30, B: 5, C: 4, D: 3 });
  const [totalLive, setTotalLive] = useState(449);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setVotes(prev => ({
        A: Math.min(100, prev.A + Math.floor(Math.random() * 2)),
        B: prev.B + Math.floor(Math.random() * 2),
        C: prev.C + Math.floor(Math.random() * 1),
        D: prev.D + Math.floor(Math.random() * 1),
      }));
      setTotalLive(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const totalVotes = votes.A + votes.B + votes.C + votes.D;
  const getPerc = (val) => Math.round((val / totalVotes) * 100) || 0;

  return (
    <section className="py-24 bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-orange-500 dark:text-orange-400 font-bold tracking-wide uppercase text-sm mb-3">
              Interactive Quizzes
            </h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
              Host live quizzes like a pro
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Engage your audience with real-time leaderboards, beautiful projector views, and instant feedback. Make every session unforgettable.
            </p>
          </motion.div>
        </div>

        {/* Dashboard Mockup Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-6xl mx-auto"
        >
          {/* Decorative Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-[2rem] blur-2xl opacity-50 dark:opacity-40 pointer-events-none" />

          {/* Main Container - Responsive Light/Dark */}
          <div className="relative rounded-2xl shadow-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a] overflow-hidden flex flex-col lg:flex-row gap-6 p-4 sm:p-6 font-sans">
            
            {/* Left Panel: Question and Options */}
            <div className="flex-1 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-6 flex flex-col">
              
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="bg-orange-500 text-white px-2.5 py-0.5 rounded-full font-bold">live</span>
                  <span className="text-gray-500 dark:text-gray-400">single choice</span>
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-xs font-mono">{totalVotes} voting</div>
              </div>

              {/* Question */}
              <div className="mb-10">
                <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  What is the output of <span className="text-orange-600 dark:text-orange-400 font-mono text-[0.9em]">typeof null</span> in JavaScript?
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Asked by Peeyush • Web Dev Cohort 26 • <span className="text-orange-600 dark:text-orange-400">10s left</span>
                </p>
              </div>

              {/* Options */}
              <div className="space-y-4 flex-1">
                {[
                  { id: 'A', label: '"null"', color: 'bg-[#f98825]', val: votes.A },
                  { id: 'B', label: '"undefined"', color: 'bg-[#4b9bf8]', val: votes.B },
                  { id: 'C', label: '"object"', color: 'bg-[#29c470]', val: votes.C },
                  { id: 'D', label: '"string"', color: 'bg-[#ab68f4]', val: votes.D },
                ].map((opt) => (
                  <div key={opt.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#2a2a2a] text-gray-700 dark:text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {opt.id}
                    </div>
                    <div className="flex-1 relative h-12 bg-gray-200 dark:bg-[#222] rounded-full overflow-hidden flex items-center">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${getPerc(opt.val)}%` }}
                        transition={{ duration: 0.5 }}
                        className={`absolute left-0 top-0 bottom-0 ${opt.color} rounded-full`}
                      />
                      <span className="relative z-10 text-gray-900 dark:text-white font-medium ml-4">{opt.label}</span>
                    </div>
                    <div className="w-10 text-right text-gray-700 dark:text-white font-mono text-sm shrink-0">
                      {getPerc(opt.val)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel: Host & Leaderboard */}
            <div className="w-full lg:w-[400px] flex flex-col gap-6">
              
              {/* Host Card */}
              <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-5">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full border-2 border-orange-500 overflow-hidden shrink-0">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Peeyush&backgroundColor=ffdfbf" alt="Host" className="w-full h-full object-cover bg-white" />
                  </div>
                  <div>
                    <h5 className="text-gray-900 dark:text-white font-bold text-lg leading-tight flex items-center gap-2">
                      Peeyush <span className="text-red-600 dark:text-red-500 text-xs font-mono uppercase bg-red-100 dark:bg-red-500/10 px-1.5 py-0.5 rounded">host</span>
                    </h5>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Web Dev Cohort 26</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-200 dark:bg-[#222] rounded-lg p-3">
                    <p className="text-gray-500 dark:text-[#888] text-[10px] font-mono uppercase mb-1">question</p>
                    <p className="text-gray-900 dark:text-white font-bold text-lg">07 / 12</p>
                  </div>
                  <div className="bg-gray-200 dark:bg-[#222] rounded-lg p-3">
                    <p className="text-gray-500 dark:text-[#888] text-[10px] font-mono uppercase mb-1">Live</p>
                    <p className="text-gray-900 dark:text-white font-bold text-lg">{totalLive}</p>
                  </div>
                  <div className="bg-gray-200 dark:bg-[#222] rounded-lg p-3">
                    <p className="text-gray-500 dark:text-[#888] text-[10px] font-mono uppercase mb-1">Avg score</p>
                    <p className="text-gray-900 dark:text-white font-bold text-lg">76%</p>
                  </div>
                </div>
              </div>

              {/* Leaderboard Card */}
              <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h5 className="text-gray-500 dark:text-[#888] text-xs font-mono uppercase">live leaderboard</h5>
                  <span className="text-gray-500 dark:text-[#888] text-xs font-mono lowercase">top 5</span>
                </div>
                
                <div className="space-y-4 flex-1">
                  {[
                    { rank: 1, name: 'Rahul', score: 909, color: 'bg-[#ab68f4]', w: '100%', avatar: 'Rahul' },
                    { rank: 2, name: 'Anjali', score: 844, color: 'bg-[#facc15]', w: '90%', avatar: 'Anjali' },
                    { rank: 3, name: 'Vikram', score: 828, color: 'bg-[#29c470]', w: '85%', avatar: 'Vikram' },
                    { rank: 4, name: 'Sneha', score: 793, color: 'bg-[#4b9bf8]', w: '80%', avatar: 'Sneha' },
                    { rank: 5, name: 'Rohan', score: 430, color: 'bg-[#f98825]', w: '45%', avatar: 'Rohan' },
                  ].map((user) => (
                    <div key={user.rank} className="flex items-center gap-3">
                      <div className="w-4 text-gray-500 dark:text-[#888] font-mono text-sm text-center shrink-0">{user.rank}</div>
                      <div className="flex-1 relative h-10 bg-gray-200 dark:bg-[#222] rounded-full overflow-hidden flex items-center p-1">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: user.w }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: user.rank * 0.1 }}
                          className={`absolute left-0 top-0 bottom-0 ${user.color} rounded-full`}
                        />
                        <div className="relative z-10 w-8 h-8 rounded-full bg-white/50 dark:bg-white/20 shrink-0 overflow-hidden">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="relative z-10 text-gray-900 dark:text-white font-bold ml-3 text-sm truncate">{user.name}</span>
                      </div>
                      <div className="w-8 text-right text-gray-700 dark:text-white font-mono text-sm font-bold shrink-0">{user.score}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LivePreview;

