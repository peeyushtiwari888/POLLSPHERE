import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import DOMPurify from 'dompurify';

const COLORS = ['#f97316', '#8b5cf6', '#3b82f6', '#10b981', '#f43f5e', '#eab308'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-gray-700">
        <p className="font-semibold">{`${label} : ${payload[0].value} votes`}</p>
      </div>
    );
  }
  return null;
};

const QuestionCard = ({ question, index, hideCharts: manualHideCharts, isPresenting, isCurrentlyLive, activeQuestionStartTime, activeUsers }) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    if (!isCurrentlyLive || !activeQuestionStartTime) return;
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isCurrentlyLive, activeQuestionStartTime]);

  const durationMs = (question.duration || 30) * 1000;
  let timeLeft = 0;
  let forceHideCharts = false;
  if (isCurrentlyLive && activeQuestionStartTime) {
    const elapsed = currentTime - new Date(activeQuestionStartTime).getTime();
    timeLeft = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));
    forceHideCharts = timeLeft > 0;
  }

  const hideCharts = manualHideCharts || forceHideCharts;

  const pieData = question.options.map(opt => ({
    name: opt.text,
    value: opt.votes
  }));

  const textLength = question.text?.replace(/<[^>]*>?/gm, '').length || 0;
  
  let textSizeClass = isPresenting ? 'text-3xl lg:text-4xl' : 'text-xl sm:text-2xl';
  if (textLength > 100) {
    textSizeClass = isPresenting ? 'text-2xl lg:text-3xl' : 'text-lg sm:text-xl';
  }
  if (textLength > 200) {
    textSizeClass = isPresenting ? 'text-xl lg:text-2xl' : 'text-base sm:text-lg';
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ delay: isPresenting ? 0 : index * 0.1, duration: 0.5, type: 'spring' }}
      className={`bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-3xl shadow-xl flex flex-col gap-6 ${isPresenting ? 'p-12 sm:p-16 w-full max-w-7xl mx-auto ring-1 ring-white/10 dark:ring-white/5' : 'p-6 sm:p-8'}`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div 
            className={`font-bold text-gray-900 dark:text-white leading-snug [&>p]:m-0 block w-full break-words break-all ${textSizeClass}`}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.text) }}
          />
        </div>
        
        <div className="flex flex-col items-end gap-3 shrink-0">
          {isCurrentlyLive && activeQuestionStartTime && timeLeft > 0 && (
            <div className={`px-6 py-2 rounded-2xl border-2 font-bold transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)] text-orange-500 border-orange-500/50 bg-orange-500/10 ${isPresenting ? 'text-4xl animate-pulse' : 'text-xl'}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </div>
          )}
          {isCurrentlyLive && activeQuestionStartTime && timeLeft === 0 && (
            <div className={`px-6 py-2 rounded-2xl border-2 font-bold transition-all text-emerald-500 border-emerald-500/50 bg-emerald-500/10 ${isPresenting ? 'text-4xl' : 'text-xl'}`}>
              Time Up!
            </div>
          )}

          <div className={`px-4 py-2 bg-gray-100/80 dark:bg-zinc-800/80 backdrop-blur-sm text-gray-500 rounded-full font-bold whitespace-nowrap shadow-sm ${isPresenting ? 'text-lg' : 'text-xs'}`}>
            {isCurrentlyLive ? `${question.totalVotes} / ${activeUsers || 0} Responded` : `${question.totalVotes} Votes`}
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-500 ${hideCharts ? 'blur-md opacity-50 select-none' : ''}`}>
        
        {/* Pie Chart (Donut) */}
        <div className={`w-full flex items-center justify-center ${isPresenting ? 'h-96 lg:h-[30rem]' : 'h-64'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={isPresenting ? 120 : 60}
                outerRadius={isPresenting ? 180 : 90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              {!hideCharts && <Tooltip content={<CustomTooltip />} />}
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Animated Progress Bars */}
        <div className={`space-y-6 ${isPresenting ? 'text-xl' : 'text-sm'}`}>
          <AnimatePresence>
            {question.options.map((option, idx) => (
              <div key={option.optionId} className="relative group">
                <div className="flex justify-between font-semibold mb-3">
                  <span className={`transition-colors flex items-center gap-2 ${!hideCharts && option.isCorrect ? 'text-emerald-600 dark:text-emerald-500 font-bold' : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                    {option.text}
                    {!hideCharts && option.isCorrect && (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 animate-in zoom-in" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className={`tabular-nums text-right pl-4 ${!hideCharts && option.isCorrect ? 'text-emerald-600 dark:text-emerald-500' : 'text-gray-900 dark:text-white'}`}>
                    {hideCharts ? '??%' : `${option.percentage}% (${option.votes})`}
                  </span>
                </div>
                <div className={`w-full bg-gray-100/50 dark:bg-zinc-800/50 backdrop-blur-sm rounded-full overflow-hidden relative shadow-inner ${isPresenting ? 'h-6' : 'h-4'}`}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: hideCharts ? '0%' : `${option.percentage}%` }}
                    transition={{ duration: 0.8, type: 'spring', bounce: 0.2 }}
                    className={`absolute top-0 left-0 h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.15)] ${!hideCharts && option.isCorrect ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : ''}`}
                    style={!hideCharts && option.isCorrect ? {} : { backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                </div>
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const LiveCenter = ({ questions, hideCharts, autoRotate, timeline = [], isPresenting, currentQuestionIndex, activeQuestionId, activeQuestionStartTime, activeUsers }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    let interval;
    if (autoRotate && containerRef.current && !isPresenting) {
      interval = setInterval(() => {
        const container = containerRef.current;
        if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
          container.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ top: 300, behavior: 'smooth' });
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoRotate, isPresenting]);

  if (!questions || questions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-transparent p-6 text-center">
        <div className="w-20 h-20 bg-orange-50 dark:bg-orange-500/10 rounded-full flex items-center justify-center mb-6 shadow-sm border border-orange-100 dark:border-orange-500/30">
          <svg className="w-10 h-10 text-orange-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Waiting for Event Data...</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md leading-relaxed mb-8">
          The poll data is currently empty or still being initialized. Please hold tight.
        </p>
      </div>
    );
  }

  if (isPresenting) {
    const currentQ = questions[currentQuestionIndex];
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black w-full h-full">
        <AnimatePresence mode="wait">
          {currentQ && (
              <QuestionCard 
                key={currentQ.questionId} 
                question={currentQ} 
                index={0} 
                hideCharts={hideCharts} 
                isPresenting={true}
                isCurrentlyLive={currentQ.questionId === activeQuestionId}
                activeQuestionStartTime={activeQuestionStartTime}
                activeUsers={activeUsers}
              />
          )}
        </AnimatePresence>
        
        {/* Simple slide indicator */}
        <div className="absolute bottom-6 flex justify-center w-full gap-2 opacity-50 hover:opacity-100 transition-opacity">
          {questions.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all ${idx === currentQuestionIndex ? 'w-8 bg-orange-500' : 'w-2 bg-gray-600'}`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-8 pb-32 scroll-smooth">
      
      {/* Response Timeline Chart */}
      {timeline.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-3xl p-6 shadow-xl"
        >
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Live Activity</h3>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="votes" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorVotes)" isAnimationActive={true} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Questions */}
      {questions.map((q, idx) => (
        <QuestionCard 
          key={q.questionId} 
          question={q} 
          index={idx} 
          hideCharts={hideCharts} 
          isPresenting={false} 
          isCurrentlyLive={q.questionId === activeQuestionId}
          activeQuestionStartTime={activeQuestionStartTime}
          activeUsers={activeUsers}
        />
      ))}
    </div>
  );
};

export default LiveCenter;
