import ChartCard from '../../../components/shared/ChartCard';

/**
 * Performance chart displaying score trends over time.
 */
export default function PerformanceChart({ className, performanceData }) {
  const hasData = performanceData && performanceData.labels.length > 0;
  
  const data = {
    labels: hasData ? performanceData.labels : ['No Data'],
    datasets: [
      {
        label: 'Average Score',
        data: hasData ? performanceData.scores : [0],
        borderColor: '#6366f1', // primary-500
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <ChartCard
      title="Performance Over Time"
      subtitle="Your average interview scores across all categories"
      type="line"
      data={data}
      className={className}
    />
  );
}
