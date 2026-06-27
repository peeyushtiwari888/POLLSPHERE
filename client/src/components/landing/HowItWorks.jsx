import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, Share2, Users, BarChart3 } from 'lucide-react';

const steps = [
  {
    title: 'Create Poll',
    description: 'Draft your questions using our intuitive builder. Configure options like privacy, multiple choices, and automatic expiry in seconds.',
    icon: PenTool,
  },
  {
    title: 'Share Link',
    description: 'Generate a unique, short public link. Share it with your audience via email, social media, or directly in your team chats.',
    icon: Share2,
  },
  {
    title: 'Collect Responses',
    description: 'Watch as your audience participates. Whether authenticated or anonymous, the voting experience is seamless on any device.',
    icon: Users,
  },
  {
    title: 'Analyze Results',
    description: 'Dive into real-time analytics. Visualize data with beautiful charts that update instantly as the votes pour in.',
    icon: BarChart3,
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50 dark:bg-zinc-900/30 border-y border-gray-100 dark:border-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-orange-500 dark:text-orange-400 font-semibold tracking-wide uppercase text-sm mb-3">
              Process
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              How it works
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Get your poll up and running in less than a minute. Our streamlined process makes feedback collection effortless.
            </p>
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 dark:bg-zinc-800 -translate-x-1/2 hidden sm:block" />

          <div className="space-y-16 relative">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row items-center gap-8 md:gap-0 ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Timeline Spacer for alternating layout */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Step Indicator (Center Icon) */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-4 border-gray-50 dark:border-zinc-900 bg-orange-100 dark:bg-orange-500/20 text-orange-500 flex items-center justify-center shadow-sm relative z-10">
                      <step.icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="w-full md:w-1/2 pl-20 md:pl-0">
                    <div className={`p-8 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow ${isEven ? 'md:ml-16' : 'md:mr-16'}`}>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 font-bold text-sm">
                          {index + 1}
                        </span>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
