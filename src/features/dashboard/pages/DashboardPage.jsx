import { useState, useEffect } from 'react';
import WelcomeBanner from '../components/WelcomeBanner';
import QuickActions from '../components/QuickActions';
import PerformanceSnapshot from '../components/PerformanceSnapshot';
import RecentInterviews from '../components/RecentInterviews';
import ReadinessScoreCard from '../components/ReadinessScoreCard';
import PracticeRecommendations from '../components/PracticeRecommendations';
import PerformanceChart from '../../analytics/components/PerformanceChart';
import { Loader2 } from 'lucide-react';

/**
 * Dashboard page — main overview after login.
 */
export default function DashboardPage() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [practicePlan, setPracticePlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('amie_token');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [analyticsRes, practiceRes] = await Promise.all([
          fetch('/api/analytics', { headers }),
          fetch('/api/practice/plan', { headers })
        ]);

        if (analyticsRes.ok) {
          setAnalyticsData(await analyticsRes.json());
        }
        if (practiceRes.ok) {
          setPracticePlan(await practiceRes.json());
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 size={40} className="animate-spin text-primary-500" />
        <h2 className="text-xl font-semibold text-surface-200">Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Top Banner */}
      <WelcomeBanner />

      {/* High-level metrics */}
      <PerformanceSnapshot historyData={analyticsData?.history || []} totalSessions={analyticsData?.totalSessions || 0} skillsData={analyticsData?.skills || [50]} />

      {/* Quick Nav */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Larger) */}
        <div className="lg:col-span-2 space-y-6">
          <PerformanceChart performanceData={analyticsData?.performance} />
          <RecentInterviews historyData={analyticsData?.history || []} />
        </div>

        {/* Right Column (Smaller) */}
        <div className="space-y-6">
          <ReadinessScoreCard skillsData={analyticsData?.skills} />
          <PracticeRecommendations practicePlan={practicePlan} />
        </div>
        
      </div>
    </div>
  );
}
