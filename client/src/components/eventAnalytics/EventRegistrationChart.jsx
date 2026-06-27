import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';

const EventRegistrationChart = ({ data = [] }) => {
  // data format expected: [{ _id: { year: 2024, month: 6 }, count: 15 }, ...]
  
  // Format data for Recharts
  const formattedData = data.map(item => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = monthNames[item._id.month - 1] || 'Unknown';
    return {
      name: `${monthName} ${item._id.year}`,
      Registrations: item.count
    };
  }).reverse(); // Reverse if they came descending, to show chronological order if needed, but let's assume they are already sorted or we just use them as is. Let's do chronological.

  // Actually, we should probably sort them chronologically just in case.
  const sortedData = [...formattedData].sort((a, b) => {
    return new Date(a.name) - new Date(b.name);
  });

  return (
    <div className="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-xl">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Registration Trend</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly registration volume across all events</p>
        </div>
      </div>

      {sortedData.length > 0 ? (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sortedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-zinc-800" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--bg-card, #ffffff)', 
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                  color: 'var(--text-primary, #111827)'
                }}
                itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="Registrations" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorReg)" 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-80 w-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800">
          <Calendar className="w-10 h-10 mb-2 opacity-50" />
          <p className="font-medium">No registration data available yet.</p>
        </div>
      )}
    </div>
  );
};

export default EventRegistrationChart;
