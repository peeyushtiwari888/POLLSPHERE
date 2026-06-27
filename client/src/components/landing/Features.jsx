import React from 'react';
import { motion } from 'framer-motion';
import { ListPlus, Activity, Ghost, ShieldCheck, Timer, Globe } from 'lucide-react';

const featuresList = [
  {
    title: 'Create Polls Instantly',
    description: 'Build beautiful, engaging single-choice polls in seconds with an intuitive, clutter-free editor.',
    icon: ListPlus,
  },
  {
    title: 'Real-Time Analytics',
    description: 'Watch responses roll in instantly via WebSockets. No need to refresh the page to see live data.',
    icon: Activity,
  },
  {
    title: 'Anonymous Responses',
    description: 'Give your audience the freedom to vote honestly without revealing their identity or logging in.',
    icon: Ghost,
  },
  {
    title: 'Secure Authentication',
    description: 'Require voters to authenticate to ensure every vote is unique and prevent duplicate submissions.',
    icon: ShieldCheck,
  },
  {
    title: 'Automated Poll Expiry',
    description: 'Set custom deadlines for your polls to create urgency and automatically close voting.',
    icon: Timer,
  },
  {
    title: 'Publish & Share Results',
    description: 'Generate beautiful public links to share the final polling outcomes with your entire community.',
    icon: Globe,
  },
];

const Features = () => {
  // Container animation for staggering children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  // Individual card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  return (
    <section id="features" className="py-24 bg-white dark:bg-zinc-950 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-orange-500/5 dark:bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-orange-500 dark:text-orange-400 font-semibold tracking-wide uppercase text-sm mb-3">
              Powerful Features
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Everything you need to run perfect polls
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              PollSphere provides a complete suite of tools designed to make collecting and analyzing feedback effortless.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuresList.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="group relative p-8 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-xl border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                <feature.icon className="w-6 h-6" />
              </div>
              
              {/* Content */}
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Features;
