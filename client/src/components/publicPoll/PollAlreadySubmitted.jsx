import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const PollAlreadySubmitted = ({ poll }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl p-8 text-center shadow-xl border border-gray-100 dark:border-zinc-800"
    >
      <div className="w-20 h-20 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Already Responded
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
        It looks like you have already submitted a response for this poll. 
        We only allow one submission per person to ensure accurate results.
      </p>
      {poll?.isResultsPublished && (
        <a 
          href={`/results/${poll._id}`}
          className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors w-full"
        >
          View Current Results
        </a>
      )}
    </motion.div>
  );
};

export default PollAlreadySubmitted;
