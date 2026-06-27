import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, BarChart2, Users, Settings, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';

const LivePreview = () => {
  // Fake chart data (height percentages)
  const chartData = [35, 45, 30, 60, 75, 50, 90, 85, 40, 65, 80, 55];

  // Fake recent responses
  const recentResponses = [
    { name: 'Alex M.', option: 'React.js', time: 'Just now', color: 'bg-blue-500' },
    { name: 'Sarah K.', option: 'Vue.js', time: '2m ago', color: 'bg-emerald-500' },
    { name: 'James T.', option: 'Svelte', time: '5m ago', color: 'bg-orange-500' },
    { name: 'Emily R.', option: 'React.js', time: '12m ago', color: 'bg-purple-500' },
  ];

  return (
    <section className="py-24 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-orange-500 dark:text-orange-400 font-semibold tracking-wide uppercase text-sm mb-3">
              Live Dashboard
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Actionable insights in real-time
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Experience a premium dashboard designed for speed and clarity. Watch your data update live without ever refreshing the page.
            </p>
          </motion.div>
        </div>

        {/* Dashboard Mockup Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Decorative Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-[2rem] blur-xl opacity-50 dark:opacity-30 pointer-events-none" />

          {/* Main Dashboard Window */}
          <div className="relative rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-[#0a0a0a] overflow-hidden flex flex-col md:flex-row h-auto md:h-[600px]">
            
            {/* Sidebar (Collapsed on mobile) */}
            <div className="hidden md:flex flex-col w-16 border-r border-gray-100 dark:border-zinc-800/50 bg-gray-50/50 dark:bg-zinc-900/20 py-6 items-center gap-6">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold mb-4">P</div>
              <button className="p-2 text-gray-900 dark:text-white bg-gray-200/50 dark:bg-zinc-800 rounded-lg"><LayoutDashboard className="w-5 h-5" /></button>
              <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><BarChart2 className="w-5 h-5" /></button>
              <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><Users className="w-5 h-5" /></button>
              <div className="mt-auto">
                <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><Settings className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
              
              {/* Top Bar */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">Poll Overview</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Frontend Framework Preferences</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium border border-green-100 dark:border-green-500/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Live Sync
                  </div>
                  <button className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-zinc-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
                    Export
                  </button>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Total Responses', value: '4,285', change: '+12.5%', isUp: true },
                  { label: 'Completion Rate', value: '86.4%', change: '+4.1%', isUp: true },
                  { label: 'Active Viewers', value: '142', change: '-2.4%', isUp: false },
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl border border-gray-100 dark:border-zinc-800/80 bg-gray-50/50 dark:bg-zinc-900/30 hover:border-gray-200 dark:hover:border-zinc-700 transition-colors">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                    <div className="flex items-end justify-between">
                      <h5 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h5>
                      <span className={`flex items-center text-xs font-medium ${stat.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {stat.isUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Chart & Side Info Split */}
              <div className="grid lg:grid-cols-3 gap-6 h-auto md:h-64">
                
                {/* Fake Bar Chart */}
                <div className="lg:col-span-2 p-5 rounded-xl border border-gray-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/20 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-6">
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white">Hourly Engagement</h5>
                    <select className="text-xs bg-transparent border-none text-gray-500 focus:ring-0 outline-none cursor-pointer">
                      <option>Today</option>
                      <option>Last 7 Days</option>
                    </select>
                  </div>
                  
                  {/* Tailwind Only CSS Chart */}
                  <div className="flex-1 flex items-end justify-between gap-1 sm:gap-2">
                    {chartData.map((height, i) => (
                      <div key={i} className="w-full relative group h-full flex items-end justify-center">
                        {/* Tooltip */}
                        <div className="absolute -top-8 opacity-0 group-hover:opacity-100 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs px-2 py-1 rounded transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-lg">
                          {height * 14} votes
                        </div>
                        {/* Bar */}
                        <div 
                          style={{ height: `${height}%` }} 
                          className="w-full max-w-[2.5rem] bg-orange-100 dark:bg-orange-500/10 group-hover:bg-orange-500 dark:group-hover:bg-orange-500 rounded-t-md transition-colors duration-300" 
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity List */}
                <div className="p-5 rounded-xl border border-gray-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/20 overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white">Live Feed</h5>
                    <Zap className="w-4 h-4 text-orange-500 fill-orange-500/20" />
                  </div>
                  <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
                    {recentResponses.map((res, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${res.color} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-inner`}>
                          {res.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {res.name} <span className="text-gray-500 dark:text-gray-400 font-normal">voted</span>
                          </p>
                          <p className="text-xs text-orange-600 dark:text-orange-400 font-medium truncate">{res.option}</p>
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{res.time}</span>
                      </div>
                    ))}
                  </div>
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
