import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-24 bg-white dark:bg-zinc-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* CTA Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-[2.5rem] bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 overflow-hidden shadow-2xl shadow-orange-500/20"
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/20 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-300/30 blur-[100px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

          {/* Abstract Grid Pattern (Optional subtle texture) */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-50" />

          <div className="relative px-6 py-20 md:py-24 lg:py-32 flex flex-col items-center text-center">
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-8 border border-white/20"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-3xl mb-6 leading-tight"
            >
              Ready to create smarter polls?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-orange-100 text-lg md:text-xl max-w-xl mx-auto mb-10"
            >
              Join thousands of creators and teams who use PollSphere to collect real-time, actionable feedback.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
            >
              {/* Primary Button */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-orange-600 hover:bg-gray-50 font-bold px-8 py-4 rounded-full transition-colors shadow-xl"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              
              {/* Secondary Button */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent text-white border-2 border-white/30 hover:border-white hover:bg-white/10 font-bold px-8 py-4 rounded-full transition-all"
              >
                Explore Demo
              </motion.button>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
