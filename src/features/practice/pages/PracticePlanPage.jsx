import { useState, useEffect } from 'react';
import PageHeader from '../../../components/shared/PageHeader';
import DailyGoals from '../components/DailyGoals';
import RoadmapTimeline from '../components/RoadmapTimeline';
import AdjustPlanModal from '../components/AdjustPlanModal';
import { Button } from '../../../components/ui';
import { Settings2, Loader2 } from 'lucide-react';

/**
 * Practice Plan page — organized roadmap and daily tasks.
 */
export default function PracticePlanPage() {
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const token = localStorage.getItem('amie_token');
        const response = await fetch('/api/practice/plan', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch plan');
        const data = await response.json();
        setPlan(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlan();
  }, []);

  const handleRegenerate = async (preferences) => {
    try {
      const token = localStorage.getItem('amie_token');
      const response = await fetch('/api/practice/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(preferences)
      });
      if (!response.ok) throw new Error('Failed to generate plan');
      const data = await response.json();
      setPlan(data);
    } catch (error) {
      console.error(error);
      alert('Failed to regenerate plan. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 size={40} className="animate-spin text-primary-500" />
        <h2 className="text-xl font-semibold text-surface-200">Generating Your AI Practice Plan...</h2>
        <p className="text-surface-400">This might take a few seconds.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <PageHeader
        title="Practice Plan"
        subtitle="Your personalized roadmap to interview success"
        actions={
          <Button variant="secondary" size="sm" icon={<Settings2 size={16} />} onClick={() => setIsModalOpen(true)}>
            Adjust Plan
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DailyGoals initialGoals={plan?.dailyGoals || []} className="sticky top-24" />
        </div>
        <div className="lg:col-span-2">
          <RoadmapTimeline weeks={plan?.weeks || []} />
        </div>
      </div>

      <AdjustPlanModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onGenerate={handleRegenerate} 
      />
    </div>
  );
}
