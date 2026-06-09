import { useState, useEffect } from 'react';
import PageHeader from '../../../components/shared/PageHeader';
import { Button } from '../../../components/ui';
import PerformanceChart from '../components/PerformanceChart';
import SkillRadar from '../components/SkillRadar';
import InterviewHistoryTable from '../components/InterviewHistoryTable';
import { Download, Loader2 } from 'lucide-react';

/**
 * Analytics page — detailed performance data and history.
 */
export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('amie_token');
        const response = await fetch('/api/analytics', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const json = await response.json();
          setData(json);
        }
      } catch (error) {
        console.error('Failed to load analytics', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 size={40} className="animate-spin text-primary-500" />
        <h2 className="text-xl font-semibold text-surface-200">Loading Analytics...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <PageHeader
        title="Analytics & Progress"
        subtitle="Track your performance metrics across all mock interviews"
        actions={
          <Button variant="secondary" size="sm" icon={<Download size={16} />}>
            Export Report
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart performanceData={data?.performance} />
        </div>
        <div>
          <SkillRadar skillData={data?.skills} />
        </div>
      </div>

      <div className="mt-8">
        <InterviewHistoryTable historyData={data?.history || []} />
      </div>
    </div>
  );
}
