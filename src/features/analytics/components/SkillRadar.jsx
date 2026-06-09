import ChartCard from '../../../components/shared/ChartCard';

/**
 * Skill radar chart displaying strengths and weaknesses.
 */
export default function SkillRadar({ className, skillData = [0, 0, 0, 0, 0] }) {
  // We'll use a doughnut chart to visualize skills breakdown instead of true radar
  // to minimize required Chart.js plugins.
  const doughnutData = {
    labels: ['Communication', 'Technical', 'Problem Solving', 'System Design', 'Behavioral'],
    datasets: [
      {
        data: skillData,
        backgroundColor: [
          '#6366f1', // primary
          '#ec4899', // accent
          '#22c55e', // success
          '#eab308', // warning
          '#8b5cf6', // purple
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <ChartCard
      title="Skill Breakdown"
      subtitle="Your relative strengths across areas"
      type="doughnut"
      data={doughnutData}
      options={{ cutout: '70%' }}
      className={className}
    />
  );
}
