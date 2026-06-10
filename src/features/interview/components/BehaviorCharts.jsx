import { Card } from '../../../components/ui';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, BarChart, Bar,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

/**
 * Time-series charts for behavioral analysis snapshots.
 */
export default function BehaviorCharts({ snapshots }) {
  if (!snapshots || snapshots.length < 2) return null;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div className="bg-surface-900 border border-surface-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs text-surface-400 mb-1">{label}s into interview</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-xs font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    );
  };

  const chartCommonProps = {
    width: '100%',
    height: 220,
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-surface-100 mb-6 flex items-center gap-2">
        <TrendingUp size={20} className="text-accent-500" />
        Behavioral Trends Over Time
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Confidence Over Time */}
        <div>
          <h4 className="text-sm font-medium text-surface-300 mb-3">Confidence Over Time</h4>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={snapshots}>
              <defs>
                <linearGradient id="confGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickFormatter={(v) => `${v}s`}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="confidenceScore"
                name="Confidence"
                stroke="#6366f1"
                fill="url(#confGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Eye Contact Over Time */}
        <div>
          <h4 className="text-sm font-medium text-surface-300 mb-3">Eye Contact Over Time</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={snapshots}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickFormatter={(v) => `${v}s`}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="eyeContactScore"
                name="Eye Contact"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ fill: '#06b6d4', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Trend */}
        <div>
          <h4 className="text-sm font-medium text-surface-300 mb-3">Engagement Trend</h4>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={snapshots}>
              <defs>
                <linearGradient id="engGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickFormatter={(v) => `${v}s`}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="engagementScore"
                name="Engagement"
                stroke="#f59e0b"
                fill="url(#engGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Body Language Consistency */}
        <div>
          <h4 className="text-sm font-medium text-surface-300 mb-3">Body Language Consistency</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={snapshots}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickFormatter={(v) => `${v}s`}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="bodyLanguageScore"
                name="Body Language"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                opacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
