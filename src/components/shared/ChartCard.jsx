import { Card } from '../ui';
import { cn } from '../../lib/utils';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

/**
 * ChartCard component for visualizing data using Chart.js
 * 
 * @param {Object} props
 * @param {string} props.title - Title of the chart
 * @param {string} props.subtitle - Optional subtitle
 * @param {'line'|'bar'|'doughnut'} props.type - Type of chart
 * @param {Object} props.data - Chart.js data object
 * @param {Object} props.options - Optional Chart.js options overrides
 */
export default function ChartCard({
  title,
  subtitle,
  type = 'line',
  data,
  options = {},
  className
}) {
  // Common default options tailored for the dark theme
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8', // surface-400
          usePointStyle: true,
          boxWidth: 6,
        }
      },
      tooltip: {
        backgroundColor: '#1e293b', // surface-800
        titleColor: '#f8fafc', // surface-50
        bodyColor: '#cbd5e1', // surface-300
        borderColor: '#334155', // surface-700
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: type !== 'doughnut' ? {
      x: {
        grid: {
          color: '#334155', // surface-700
          drawBorder: false,
        },
        ticks: {
          color: '#64748b', // surface-500
        }
      },
      y: {
        grid: {
          color: '#1e293b', // surface-800
          drawBorder: false,
        },
        ticks: {
          color: '#64748b', // surface-500
        }
      }
    } : undefined
  };

  const mergedOptions = { ...defaultOptions, ...options };

  const renderChart = () => {
    if (!data) return <div className="flex h-full items-center justify-center text-surface-500">No data provided</div>;

    switch (type) {
      case 'bar':
        return <Bar data={data} options={mergedOptions} />;
      case 'doughnut':
        return <Doughnut data={data} options={mergedOptions} />;
      case 'line':
      default:
        return <Line data={data} options={mergedOptions} />;
    }
  };

  return (
    <Card className={cn("flex flex-col", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-surface-100">{title}</h3>
        {subtitle && <p className="text-sm text-surface-400">{subtitle}</p>}
      </div>
      <div className="relative flex-1 w-full min-h-[250px]">
        {renderChart()}
      </div>
    </Card>
  );
}
