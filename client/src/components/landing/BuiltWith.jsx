import React from 'react';
import { motion } from 'framer-motion';
import { Component, Server, Cpu, Database, Zap, Wind } from 'lucide-react';

const technologies = [
  { name: 'React', icon: Component, color: 'text-blue-500', bgHover: 'hover:bg-blue-50 dark:hover:bg-blue-500/10', borderHover: 'hover:border-blue-200 dark:hover:border-blue-500/30' },
  { name: 'Node.js', icon: Server, color: 'text-green-600', bgHover: 'hover:bg-green-50 dark:hover:bg-green-500/10', borderHover: 'hover:border-green-200 dark:hover:border-green-500/30' },
  { name: 'Express', icon: Cpu, color: 'text-gray-700 dark:text-gray-300', bgHover: 'hover:bg-gray-100 dark:hover:bg-zinc-800', borderHover: 'hover:border-gray-300 dark:hover:border-zinc-700' },
  { name: 'MongoDB', icon: Database, color: 'text-emerald-500', bgHover: 'hover:bg-emerald-50 dark:hover:bg-emerald-500/10', borderHover: 'hover:border-emerald-200 dark:hover:border-emerald-500/30' },
  { name: 'Socket.io', icon: Zap, color: 'text-zinc-900 dark:text-white', bgHover: 'hover:bg-gray-100 dark:hover:bg-zinc-800', borderHover: 'hover:border-gray-300 dark:hover:border-zinc-700' },
  { name: 'Tailwind CSS', icon: Wind, color: 'text-cyan-500', bgHover: 'hover:bg-cyan-50 dark:hover:bg-cyan-500/10', borderHover: 'hover:border-cyan-200 dark:hover:border-cyan-500/30' },
];

const BuiltWith = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="py-16 bg-gray-50/50 dark:bg-zinc-950/50 border-y border-gray-100 dark:border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Small Heading */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold tracking-wide text-gray-500 dark:text-gray-400 uppercase">
            Powered by modern technologies
          </p>
        </div>

        {/* Technology Badges */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-wrap justify-center items-center gap-4 md:gap-6"
        >
          {technologies.map((tech) => (
            <motion.div
              key={tech.name}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`
                flex items-center gap-3 px-6 py-3.5 
                bg-white dark:bg-zinc-900 
                border border-gray-200 dark:border-zinc-800 
                rounded-xl shadow-sm cursor-pointer
                transition-colors duration-300
                ${tech.bgHover} ${tech.borderHover}
              `}
            >
              <tech.icon className={`w-5 h-5 ${tech.color}`} />
              <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm md:text-base">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default BuiltWith;
