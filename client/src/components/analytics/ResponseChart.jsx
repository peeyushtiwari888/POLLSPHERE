import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { BarChart3, Inbox } from 'lucide-react';

/**
 * Custom Tooltip for Recharts to match our Tailwind Dark/Light UI
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-4 rounded-xl shadow-lg">
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          <span className="text-orange-500 mr-2">●</span>
          {payload[0].value} {payload[0].value === 1 ? 'Response' : 'Responses'}
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Response Chart Component
 * 
 * Visualizes the aggregated option counts or time-series data using Recharts.
 * Fully responsive and adapts to Tailwind's dark/light modes via custom tooltips and styling.
 * 
 * @param {Array} chartData - Array of data objects, e.g., [{ name: 'Option A', count: 42 }]
 */
const ResponseChart = ({ chartData = [] }) => {
  
  // Empty State if no data is provided or array is empty
  if (!chartData || chartData.length === 0) {
    return (
      <div className="w-full h-full min-h-[350px] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-950 rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-zinc-800">
          <Inbox className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Data Available</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
          There are not enough responses to generate a chart yet. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-orange-50 dark:bg-orange-500/10 rounded-xl border border-orange-100 dark:border-orange-900/30">
          <BarChart3 className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Response Overview
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Visual breakdown of incoming poll data
          </p>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barSize={40}
          >
            {/* Grid Lines - subtle to match premium UI */}
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#e5e7eb" // Tailwind gray-200
              className="dark:opacity-10" // Make it very subtle in dark mode
            />
            
            {/* Axes */}
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} // Tailwind gray-400
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
              dx={-10}
              allowDecimals={false} // Ensure we only show whole numbers for counts
            />
            
            {/* Custom Tooltip built with Tailwind */}
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'rgba(249, 115, 22, 0.05)' }} // Very subtle orange hover highlight
            />
            
            {/* Bars */}
            <Bar 
              dataKey="count" 
              radius={[6, 6, 0, 0]} // Rounded top corners
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill="#f97316" // Tailwind orange-500
                  className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default ResponseChart;
