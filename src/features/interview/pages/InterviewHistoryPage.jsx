import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/shared/PageHeader';
import { Card, Badge, Input, Select } from '../../../components/ui';
import EmptyState from '../../../components/shared/EmptyState';
import { Calendar, Clock, Trophy, ChevronRight, Search, Filter } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

export default function InterviewHistoryPage() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('amie_token');
        const res = await fetch('/api/replay/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setInterviews(data);
        }
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredInterviews = interviews
    .filter(i => i.jobRole.toLowerCase().includes(search.toLowerCase()) || i.techStack.some(t => t.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'highestScore') return (b.overallScore || 0) - (a.overallScore || 0);
      return 0;
    });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <PageHeader 
        title="Interview History" 
        description="Review past mock interviews and track your progress over time."
      />

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
          <Input 
            placeholder="Search by role or tech stack..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={18} className="text-surface-400" />
          <Select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-48"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highestScore">Highest Score</option>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : filteredInterviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInterviews.map((interview) => (
            <Card key={interview._id} variant="glass" className="flex flex-col hover:border-primary-500/50 transition-colors group cursor-pointer" onClick={() => navigate(`/interviews/${interview._id}/replay`)}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-surface-100">{interview.jobRole}</h3>
                  <p className="text-sm text-surface-400 flex items-center gap-1.5 mt-1">
                    <Calendar size={14} />
                    {format(new Date(interview.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 ${interview.overallScore >= 80 ? 'border-success-500/50 text-success-400 bg-success-500/10' : interview.overallScore >= 60 ? 'border-warning-500/50 text-warning-400 bg-warning-500/10' : 'border-danger-500/50 text-danger-400 bg-danger-500/10'}`}>
                  {interview.overallScore || 0}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {interview.techStack.slice(0, 3).map((tech, idx) => (
                  <Badge key={idx} variant="outline" size="sm">{tech}</Badge>
                ))}
                {interview.techStack.length > 3 && (
                  <Badge variant="outline" size="sm">+{interview.techStack.length - 3}</Badge>
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-surface-800 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-surface-400">
                  <span className="flex items-center gap-1">
                    <Trophy size={14} className="text-accent-400" />
                    {interview.totalQuestions || 0} Qs
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {Math.floor((interview.duration || 0) / 60)}m {(interview.duration || 0) % 60}s
                  </span>
                </div>
                <div className="flex items-center gap-1 text-primary-400 text-sm font-medium group-hover:text-primary-300">
                  Replay <ChevronRight size={16} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={<Calendar />}
          title="No Interviews Found"
          description={search ? "No completed interviews matched your search criteria." : "You haven't completed any mock interviews yet."}
          action={{ label: "Start an Interview", onClick: () => navigate('/interview/setup') }}
        />
      )}
    </div>
  );
}
