import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Product Manager at TechCorp',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4',
    content: 'PollSphere completely transformed how we gather feedback from our beta users. The real-time analytics are absolutely stunning and easy to present to stakeholders.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Event Organizer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=c0aede',
    content: 'We used PollSphere for our annual summit with over 5,000 attendees. It handled the traffic flawlessly and the audience loved the interactive experience.',
    rating: 5,
  },
  {
    name: 'Elena Rodriguez',
    role: 'Marketing Director',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=ffdfba',
    content: 'The ability to customize the look and feel of our polls to match our brand is a game changer. PollSphere feels like a true premium SaaS product.',
    rating: 5,
  },
  {
    name: 'David Kim',
    role: 'UX Researcher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=d1f4d9',
    content: 'I have tried dozens of polling tools, but nothing comes close to the user experience of PollSphere. It’s incredibly intuitive and blazingly fast.',
    rating: 5,
  },
  {
    name: 'Jessica Alba',
    role: 'Community Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica&backgroundColor=ffdfba',
    content: 'Engagement in our community skyrocketed after we introduced live polls using this platform. It feels magical how fast the votes sync.',
    rating: 5,
  },
  {
    name: 'Tom Hardy',
    role: 'Engineering Lead',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom&backgroundColor=b6e3f4',
    content: 'The API is robust, and the real-time websocket integration was a breeze. PollSphere is clearly built with developers in mind.',
    rating: 5,
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-gray-50 dark:bg-[#0a0a0a] border-y border-gray-200/50 dark:border-zinc-900 overflow-hidden relative">
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
      </div>

      {/* Marquee Section (Full Width) */}
      <div className="relative w-full overflow-hidden marquee-container group pb-4">
        <style>
          {`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .marquee-content {
              animation: marquee 40s linear infinite;
            }
            .marquee-container:hover .marquee-content {
              animation-play-state: paused;
            }
          `}
        </style>
        
        <div className="flex gap-6 w-max marquee-content px-6">
          {/* Render the array twice to create a seamless infinite loop */}
          {[...testimonials, ...testimonials].map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow flex flex-col w-[350px] shrink-0"
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
              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-100 dark:border-[#2a2a2a]">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-[#2a2a2a]"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Gradients on edges for smooth fade effect */}
        <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-gray-50 dark:from-[#0a0a0a] to-transparent pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-gray-50 dark:from-[#0a0a0a] to-transparent pointer-events-none" />
      </div>
    </section>
  );
};

export default Testimonials;
