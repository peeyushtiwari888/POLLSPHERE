import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Product Manager at TechCorp',
    avatar: 'https://i.pravatar.cc/150?img=47',
    content: 'PollSphere completely transformed how we gather feedback from our beta users. The real-time analytics are absolutely stunning and easy to present to stakeholders.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Event Organizer',
    avatar: 'https://i.pravatar.cc/150?img=11',
    content: 'We used PollSphere for our annual summit with over 5,000 attendees. It handled the traffic flawlessly and the audience loved the interactive experience.',
    rating: 5,
  },
  {
    name: 'Elena Rodriguez',
    role: 'Marketing Director',
    avatar: 'https://i.pravatar.cc/150?img=32',
    content: 'The ability to customize the look and feel of our polls to match our brand is a game changer. PollSphere feels like a true premium SaaS product.',
    rating: 5,
  },
];

const Testimonials = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="py-24 bg-gray-50/50 dark:bg-zinc-950/50 border-y border-gray-100 dark:border-zinc-900 overflow-hidden relative">
      {/* Decorative Blur Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
            Loved by forward-thinking teams
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            See why thousands of creators and organizations trust PollSphere for their most important decisions.
          </p>
        </div>

        {/* Testimonials Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 flex-1">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-100 dark:border-zinc-800">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-zinc-700"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Testimonials;
