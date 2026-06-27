import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What is PollSphere?',
    answer: 'PollSphere is a modern, real-time polling platform designed for teams, educators, and creators. It allows you to create engaging polls, collect responses seamlessly, and analyze live data instantly without any page refreshes.',
  },
  {
    question: 'Can I create anonymous polls?',
    answer: 'Yes! You have full control over privacy. You can configure your polls to accept anonymous responses, or you can enforce authentication to ensure that each voter is unique and can only vote once.',
  },
  {
    question: 'How does the real-time analytics work?',
    answer: 'Our analytics dashboard is powered by WebSockets. The exact moment a participant submits a vote, your charts, response counts, and statistics update instantly on your dashboard. No manual reloading is required.',
  },
  {
    question: 'Can I publish and share the final results?',
    answer: 'Absolutely. Once your poll concludes—or even while it is still active—you can generate a beautiful public results link. You can easily share this link with your community or embed it anywhere.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-gray-50/50 dark:bg-zinc-950/50 border-y border-gray-100 dark:border-zinc-900">
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
              Support & Answers
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Frequently Asked Questions
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Got questions? We've got answers. Learn more about how PollSphere can help you collect feedback efficiently.
            </p>
          </motion.div>
        </div>

        {/* Accordion Container */}
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm"
          >
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div 
                  key={index} 
                  className={`border-b border-gray-100 dark:border-zinc-800 last:border-none transition-colors ${
                    isOpen ? 'bg-gray-50/50 dark:bg-zinc-900/50' : 'hover:bg-gray-50/30 dark:hover:bg-zinc-900/30'
                  }`}
                >
                  <h3>
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full flex items-center justify-between py-5 px-6 md:px-8 text-left focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className="text-base md:text-lg font-medium text-gray-900 dark:text-gray-100">
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex-shrink-0 ml-4 text-gray-400 dark:text-gray-500"
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.div>
                    </button>
                  </h3>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 px-6 md:px-8 text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>

          {/* CTA Box below FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 dark:text-gray-400">
              Still have questions?{' '}
              <a href="#" className="font-medium text-orange-500 hover:text-orange-600 transition-colors">
                Contact our support team
              </a>
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default FAQ;
