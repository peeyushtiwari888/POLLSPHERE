import React from 'react';
import StatCard from './StatCard';
import { BarChart3, Activity, CheckCircle2, Users } from 'lucide-react';

/**
 * StatsCards Component
 * 
 * Renders a responsive grid of statistics cards for the dashboard overview.
 * This is a pure presentational component that consumes the `stats` prop.
 * 
 * @param {Object} stats - The aggregated stats object from the backend
 */
const StatsCards = ({ stats }) => {
  // Map the backend data directly to the UI configuration array.
  // We provide `0` as a safe fallback in case the API response is missing any fields.
  // Note: We've removed the mock 'trend' strings since historical API data isn't available yet.
  const statsData = [
    {
      title: 'Total Polls',
      value: stats?.totalPolls || 0,
      icon: BarChart3,
      trend: null, 
      trendType: 'neutral',
      color: 'blue'
    },
    {
      title: 'Active Polls',
      value: stats?.activePolls || 0,
      icon: Activity,
      trend: null,
      trendType: 'neutral',
      color: 'orange' // Brand primary accent
    },
    {
      title: 'Published Polls',
      value: stats?.publishedPolls || 0,
      icon: CheckCircle2,
      trend: null,
      trendType: 'neutral',
      color: 'green'
    },
    {
      title: 'Total Responses',
      value: stats?.totalResponses?.toLocaleString() || 0,
      icon: Users,
      trend: null,
      trendType: 'neutral',
      color: 'purple'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          trendType={stat.trendType}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default StatsCards;
