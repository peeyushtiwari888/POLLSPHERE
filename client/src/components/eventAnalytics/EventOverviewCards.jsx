import React from 'react';
import { Users, CalendarDays, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

const EventOverviewCards = ({ stats }) => {
  if (!stats) return null;

  const { 
    totalRegistrations = 0, 
    upcomingEvents = 0, 
    completedEvents = 0, 
    cancelledEvents = 0, 
    attendanceRate = 0 
  } = stats;

  const cards = [
    {
      title: 'Total Registrations',
      value: totalRegistrations,
      icon: Users,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-500/10',
      trend: '+12% this month' // Placeholder for trend
    },
    {
      title: 'Upcoming Events',
      value: upcomingEvents,
      icon: CalendarDays,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-500/10',
    },
    {
      title: 'Completed Events',
      value: completedEvents,
      icon: CheckCircle,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
    },
    {
      title: 'Capacity Filled',
      value: `${Math.round(attendanceRate)}%`,
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      title: 'Cancelled Events',
      value: cancelledEvents,
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-500/10',
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <div 
          key={index}
          className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.bgColor} ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
            
            <div>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {card.value}
              </p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                {card.title}
              </p>
              {card.trend && (
                <p className="text-xs font-semibold text-green-500 mt-2">
                  {card.trend}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventOverviewCards;
