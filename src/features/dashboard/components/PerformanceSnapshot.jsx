import { Card } from '../../../components/ui';
import StatCard from '../../../components/shared/StatCard';
import { cn } from '../../../lib/utils';
import { Mic, Trophy, Clock, TrendingUp, Target } from 'lucide-react';

/**
 * Performance snapshot — key stats overview.
 */
export default function PerformanceSnapshot({ historyData = [], totalSessions = 0, skillsData = [50], className }) {
  let avgScore = 0;
  if (historyData.length > 0) {
    const total = historyData.reduce((sum, item) => sum + item.score, 0);
    avgScore = Math.round(total / historyData.length);
  }

  const stats = [
    {
      title: 'Overall Score',
      value: historyData.length > 0 ? `${avgScore}%` : '--',
      change: '+2.4%',
      trend: 'up',
      icon: <TrendingUp size={20} />
    },
    {
      title: 'Interviews Taken',
      value: historyData.length.toString(),
      change: 'This month',
      trend: 'neutral',
      icon: <Target size={20} />
    },
    {
      title: 'Practice Time',
      value: `${Math.floor((totalSessions * 5) / 60)}h ${(totalSessions * 5) % 60}m`,
      change: `+${totalSessions * 5}m`,
      trend: 'up',
      icon: <Clock size={20} />
    },
    {
      title: 'Interview Readiness',
      value: `${Math.round(skillsData.reduce((a, b) => a + b, 0) / skillsData.length)}/100`,
      change: 'Steady',
      trend: 'neutral',
      icon: <TrendingUp size={20} />
    },
  ];

  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
