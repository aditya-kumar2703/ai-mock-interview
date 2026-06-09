import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import PageHeader from '../../../components/shared/PageHeader';
import { Button, Card, Badge } from '../../../components/ui';
import ScoreSummary from '../components/ScoreSummary';
import EmptyState from '../../../components/shared/EmptyState';
import { RotateCcw, Download, Trophy, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatDuration } from '../../../lib/utils';

/**
 * Interview Result page — shows scores and feedback after a session.
 */
export default function InterviewResultPage() {
  const location = useLocation();
  const { timeElapsed = 0, interviewId } = location.state || {};
  
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!interviewId) {
        setIsLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem('amie_token');
        const response = await fetch(`/api/sessions/${interviewId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        // Map backend sessions to frontend format
        const mappedData = data.map((session, index) => ({
          id: session._id,
          questionNumber: index + 1,
          question: session.question,
          userAnswer: session.userAnswer,
          score: session.score,
          status: session.score >= 80 ? 'success' : session.score >= 60 ? 'warning' : 'danger',
          comment: session.feedback
        }));
        
        setFeedbacks(mappedData);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [interviewId]);

  const hasData = feedbacks.length > 0;
  
  const overallScore = hasData 
    ? Math.round(feedbacks.reduce((acc, curr) => acc + curr.score, 0) / feedbacks.length)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-10">
      <PageHeader
        title="Interview Results"
        subtitle={`Session completed in ${formatDuration(timeElapsed)}`}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" icon={<Download size={16} />} disabled={!hasData}>
              Export
            </Button>
            <Button to="/interview/setup" variant="primary" size="sm" icon={<RotateCcw size={16} />}>
              Practice Again
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Detailed Feedback */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-surface-100 mb-6">
              Detailed Feedback
            </h3>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4" />
                <p className="text-surface-400">Loading your AI feedback...</p>
              </div>
            ) : !hasData ? (
              <EmptyState
                title="No interview data found"
                description="Complete an interview session to see your detailed question-by-question feedback."
                icon={<Trophy size={28} className="text-surface-500" />}
              />
            ) : (
              <div className="space-y-6">
                {feedbacks.map((item) => (
                  <div key={item.id} className="pb-6 border-b border-surface-800 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <Badge variant="info" className="mb-2">Question {item.questionNumber}</Badge>
                        <p className="text-sm font-medium text-surface-200">{item.question}</p>
                      </div>
                      <Badge variant={item.status} size="lg" className="shrink-0">{item.score}/100</Badge>
                    </div>
                    
                    <div className="bg-surface-900/50 rounded-xl p-4 mb-3 border border-surface-800">
                      <p className="text-xs text-surface-400 mb-1 font-medium uppercase tracking-wider">Your Answer:</p>
                      <p className="text-sm text-surface-300 italic">"{item.userAnswer}"</p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {item.status === 'success' ? (
                          <CheckCircle size={16} className="text-success-500" />
                        ) : (
                          <AlertTriangle size={16} className={`text-${item.status}-500`} />
                        )}
                      </div>
                      <p className="text-sm text-surface-400">
                        <span className="font-semibold text-surface-300">AI Feedback: </span>
                        {item.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Score Summary */}
        <div>
          <ScoreSummary 
            overallScore={overallScore}
            technicalScore={hasData ? overallScore + 5 : 0}
            communicationScore={hasData ? overallScore - 2 : 0}
            problemSolvingScore={hasData ? overallScore + 3 : 0}
            confidenceScore={hasData ? overallScore - 5 : 0}
            className="sticky top-24"
          />
        </div>
      </div>
    </div>
  );
}
