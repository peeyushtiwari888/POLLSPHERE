import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link, QrCode, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LiveSidebar = ({ pollId, totalResponses, participationCode }) => {
  const joinUrl = `${window.location.origin}/poll/${pollId}`;
  const [feed, setFeed] = useState([]);
  const [prevTotal, setPrevTotal] = useState(totalResponses);

  // Generate dynamic mock feed items whenever totalResponses increases
  useEffect(() => {
    if (totalResponses > prevTotal) {
      const diff = totalResponses - prevTotal;
      const newItems = Array.from({ length: Math.min(diff, 5) }).map((_, i) => ({
        id: Date.now() + i,
        message: 'New response received!',
        time: 'Just now'
      }));

      setFeed(prev => [...newItems, ...prev].slice(0, 10)); // Keep last 10
      setPrevTotal(totalResponses);
    }
  }, [totalResponses, prevTotal]);

  return (
    <aside className="w-full lg:w-96 border-l border-white/20 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-2xl p-6 flex flex-col gap-8 h-full overflow-y-auto scrollbar-hide">
      
      {/* QR Code Section */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-6 border border-white/20 dark:border-zinc-800/50 shadow-xl flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-bold">
          <QrCode className="w-5 h-5 text-indigo-500" />
          Scan to Join
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
          <QRCodeSVG value={joinUrl} size={180} level="H" />
        </div>
        
        {participationCode && (
          <div className="flex flex-col items-center justify-center w-full mb-4 bg-orange-50 dark:bg-orange-500/10 p-3 rounded-xl border border-orange-100 dark:border-orange-500/30">
            <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 mb-0.5 uppercase tracking-wider">Participation Code</span>
            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-widest">{participationCode}</span>
          </div>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">Or visit link:</p>
        <div className="flex items-center justify-center gap-2 bg-gray-100/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl px-4 py-2 w-full shadow-inner border border-white/10 dark:border-zinc-700/50">
          <Link className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-mono text-gray-900 dark:text-white truncate">
            {joinUrl.replace(/^https?:\/\//, '')}
          </span>
        </div>
      </div>

      {/* Live Feed Section */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-bold px-2">
          <Activity className="w-5 h-5 text-orange-500" />
          Live Activity Feed
        </div>
        
        <div className="flex-1 relative">
          {feed.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-zinc-500 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-md rounded-3xl border border-dashed border-gray-300 dark:border-zinc-700">
              <Zap className="w-8 h-8 mb-2 opacity-50 text-orange-400" />
              <p className="text-sm text-center px-4 font-medium">Waiting for incoming responses...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {feed.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-emerald-100/50 dark:border-emerald-900/30 rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.time}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default LiveSidebar;
