import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Tag } from 'lucide-react';

const COLORS = ['#6366f1', '#f97316', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#eab308'];

const EventCategoryChart = ({ data = [] }) => {
  // data format expected: [{ _id: 'Technology', count: 5 }, ...]
  
  const formattedData = data.map(item => ({
    name: item._id || 'Uncategorized',
    value: item.count
  }));

  return (
    <div className="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-orange-50 dark:bg-orange-500/10 text-orange-500 rounded-xl">
          <Tag className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Category Distribution</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Events broken down by category</p>
        </div>
      </div>

      {formattedData.length > 0 ? (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--bg-card, #ffffff)', 
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                  color: 'var(--text-primary, #111827)'
                }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', fontWeight: '500' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-72 w-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800">
          <Tag className="w-10 h-10 mb-2 opacity-50" />
          <p className="font-medium">No category data available.</p>
        </div>
      )}
    </div>
  );
};

export default EventCategoryChart;
