import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/shared/PageHeader';
import { Card, Badge, Button, ProgressBar } from '../../../components/ui';
import { Play, Pause, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, Lightbulb, Clock, Mic, Edit3, Save } from 'lucide-react';
import { format } from 'date-fns';
import ScoreSummary from '../components/ScoreSummary';
import BehaviorReport from '../components/BehaviorReport';
import BehaviorCharts from '../components/BehaviorCharts';

export default function InterviewReplayPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [noteText, setNoteText] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  useEffect(() => {
    const fetchReplay = async () => {
      try {
        const token = localStorage.getItem('amie_token');
        const [timelineRes, summaryRes] = await Promise.all([
          fetch(`/api/replay/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`/api/replay/${id}/summary`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        
        if (timelineRes.ok && summaryRes.ok) {
          const tData = await timelineRes.json();
          const sData = await summaryRes.json();
          setData(tData);
          setSummary(sData);
          if (tData.sessions && tData.sessions.length > 0) {
            setNoteText(tData.sessions[0].userNotes || '');
          }
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (err) {
        console.error('Fetch replay error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReplay();
  }, [id]);

  const handleQuestionChange = (idx) => {
    setCurrentIdx(idx);
    setNoteText(data.sessions[idx].userNotes || '');
    setIsPlaying(false);
  };

  const saveNote = async () => {
    setIsSavingNote(true);
    try {
      const token = localStorage.getItem('amie_token');
      const sessionId = data.sessions[currentIdx]._id;
      
      const res = await fetch(`/api/replay/sessions/${sessionId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ note: noteText })
      });
      
      if (res.ok) {
        // Update local state
        const updatedSessions = [...data.sessions];
        updatedSessions[currentIdx].userNotes = noteText;
        setData({ ...data, sessions: updatedSessions });
      }
    } catch (err) {
      console.error('Error saving note:', err);
    } finally {
      setIsSavingNote(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || !data.interview) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-surface-100 mb-2">Interview Not Found</h2>
        <Button onClick={() => navigate('/interviews/history')}>Back to History</Button>
      </div>
    );
  }

  const { interview, sessions, behavior } = data;
  const currentSession = sessions[currentIdx];

  const getAverage = (key) => sessions.length > 0 ? Math.round(sessions.reduce((acc, curr) => acc + (curr[key] || 0), 0) / sessions.length) : 0;
  const avgTech = getAverage('technicalScore');
  const avgComm = getAverage('communicationScore');
  const avgPS = getAverage('score'); // fallback map
  const avgConfidence = getAverage('confidenceScore');
  const avgBehavior = behavior ? Math.round(
    (behavior.confidenceScore + behavior.eyeContactScore + behavior.bodyLanguageScore + behavior.engagementScore + behavior.smileScore) / 5
  ) : null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-surface-800 pb-6">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/interviews/history')} className="mb-2 -ml-3">
            <ChevronLeft size={16} /> Back to History
          </Button>
          <h1 className="text-3xl font-bold text-surface-100 mb-2">{interview.jobRole} Replay</h1>
          <div className="flex items-center gap-4 text-sm text-surface-400">
            <span>{format(new Date(interview.createdAt), 'MMMM d, yyyy')}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {Math.floor(interview.duration / 60)}m {interview.duration % 60}s</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Mic size={14} /> Voice/Text</span>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar: Question Navigator */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-semibold text-surface-200 mb-4 px-2">Timeline</h3>
          <div className="space-y-2">
            {sessions.map((sess, idx) => (
              <button
                key={sess._id}
                onClick={() => handleQuestionChange(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${currentIdx === idx ? 'bg-primary-500/10 border-primary-500 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'bg-surface-900 border-surface-800 hover:border-surface-700'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-xs font-bold ${currentIdx === idx ? 'text-primary-400' : 'text-surface-400'}`}>Q{idx + 1}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sess.score >= 80 ? 'bg-success-500/20 text-success-400' : sess.score >= 60 ? 'bg-warning-500/20 text-warning-400' : 'bg-danger-500/20 text-danger-400'}`}>
                    {sess.score}%
                  </span>
                </div>
                <p className={`text-sm line-clamp-2 ${currentIdx === idx ? 'text-surface-200' : 'text-surface-400'}`}>
                  {sess.question}
                </p>
                <div className="text-[10px] text-surface-500 mt-2">
                  {format(new Date(sess.timestamp), 'h:mm a')}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-surface-800">
             <ScoreSummary
                overallScore={interview.overallScore}
                technicalScore={avgTech || avgPS - 2}
                communicationScore={avgComm || avgPS + 1}
                problemSolvingScore={avgPS}
                confidenceScore={avgConfidence || avgPS - 4}
                behavioralScore={avgBehavior}
             />
          </div>
        </div>

        {/* Right Content: Replay Area */}
        <div className="lg:col-span-3 space-y-6">
          {currentSession && (
            <>
              {/* Question & Answer Card */}
              <Card className="p-8 border border-primary-500/20 shadow-[0_0_30px_rgba(99,102,241,0.05)]">
                <div className="flex items-center justify-between mb-6">
                  <Badge variant="primary" size="lg">Question {currentIdx + 1} of {sessions.length}</Badge>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleQuestionChange(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0}>
                      <ChevronLeft size={16} /> Prev
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleQuestionChange(Math.min(sessions.length - 1, currentIdx + 1))} disabled={currentIdx === sessions.length - 1}>
                      Next <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>

                <h2 className="text-xl font-medium text-surface-100 leading-relaxed mb-8">
                  {currentSession.question}
                </h2>

                <div className="bg-surface-900 rounded-xl p-6 border border-surface-800">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-surface-300">Your Answer</h4>
                    {currentSession.speakingTime && (
                      <span className="text-xs text-surface-500">{currentSession.speakingTime}s speaking time</span>
                    )}
                  </div>
                  
                  {currentSession.audioUrl && (
                    <div className="mb-4 flex items-center gap-4 bg-surface-950 p-3 rounded-lg border border-surface-800">
                       <audio src={currentSession.audioUrl} controls className="w-full h-10 custom-audio-player" />
                    </div>
                  )}

                  <p className="text-surface-300 leading-relaxed whitespace-pre-wrap font-mono text-sm">
                    {currentSession.userAnswer || currentSession.transcript || "No answer provided."}
                  </p>
                </div>
              </Card>

              {/* AI Evaluation Panel */}
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-surface-100">AI Evaluation</h3>
                  <div className={`text-2xl font-bold ${currentSession.score >= 80 ? 'text-success-400' : currentSession.score >= 60 ? 'text-warning-400' : 'text-danger-400'}`}>
                    {currentSession.score}/100
                  </div>
                </div>

                {/* Structured Feedback (Strengths, Weaknesses, Suggestions) */}
                {currentSession.strengths && currentSession.strengths.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="bg-success-500/10 border border-success-500/20 rounded-xl p-5">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-success-400 mb-3">
                          <CheckCircle size={16} /> Strengths
                        </h4>
                        <ul className="space-y-2">
                          {currentSession.strengths.map((s, i) => <li key={i} className="text-sm text-surface-300 flex items-start gap-2"><span className="text-success-500 mt-1">•</span>{s}</li>)}
                        </ul>
                      </div>
                      <div className="bg-danger-500/10 border border-danger-500/20 rounded-xl p-5">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-danger-400 mb-3">
                          <AlertTriangle size={16} /> Weaknesses
                        </h4>
                        <ul className="space-y-2">
                          {currentSession.weaknesses.map((w, i) => <li key={i} className="text-sm text-surface-300 flex items-start gap-2"><span className="text-danger-500 mt-1">•</span>{w}</li>)}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-accent-500/10 border border-accent-500/20 rounded-xl p-5 h-full">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-accent-400 mb-3">
                        <Lightbulb size={16} /> Suggestions for Improvement
                      </h4>
                      <ul className="space-y-3">
                        {currentSession.suggestions.map((s, i) => <li key={i} className="text-sm text-surface-300 flex items-start gap-2"><span className="text-accent-500 mt-1">•</span>{s}</li>)}
                      </ul>
                      <div className="mt-6 pt-4 border-t border-accent-500/20">
                         <h5 className="text-xs font-semibold text-surface-400 mb-2 uppercase tracking-wider">Detailed Feedback</h5>
                         <p className="text-sm text-surface-300 leading-relaxed">{currentSession.feedback}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Fallback for older sessions without structured feedback
                  <div className="bg-surface-900 rounded-xl p-6 border border-surface-800">
                     <p className="text-surface-300 leading-relaxed">{currentSession.feedback}</p>
                  </div>
                )}
              </Card>

              {/* Personal Notes System */}
              <Card variant="glass" className="border-primary-500/20 bg-primary-500/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-semibold text-primary-100 flex items-center gap-2">
                    <Edit3 size={18} className="text-primary-400" />
                    Personal Notes
                  </h3>
                  <Button variant="primary" size="sm" onClick={saveNote} disabled={isSavingNote} icon={<Save size={14} />}>
                    {isSavingNote ? 'Saving...' : 'Save Note'}
                  </Button>
                </div>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add your reflections, what to study, or things to remember for this question..."
                  className="w-full h-32 bg-surface-950 border border-surface-800 rounded-xl p-4 text-sm text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none transition-all"
                />
              </Card>
            </>
          )}

          {/* Behavior Dashboard (shown at the bottom of Replay page) */}
          {behavior && currentIdx === sessions.length - 1 && (
            <div className="mt-12 space-y-6">
              <h2 className="text-2xl font-bold text-surface-100 border-b border-surface-800 pb-4">Overall Behavioral Analysis</h2>
              <BehaviorReport report={behavior} />
              <BehaviorCharts snapshots={behavior.snapshots} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
