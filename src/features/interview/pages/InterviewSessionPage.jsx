import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Badge } from '../../../components/ui';
import InterviewTimer from '../components/InterviewTimer';
import AnswerInput from '../components/AnswerInput';
import ChatBubble from '../components/ChatBubble';
import WebcamPreview from '../components/WebcamPreview';
import useWebcamAnalysis from '../../../hooks/useWebcamAnalysis';
import { StopCircle, Volume2, VolumeX, Camera, CameraOff } from 'lucide-react';

// Mock Data
const MOCK_QUESTIONS = [
  {
    id: 1,
    category: 'Technical',
    question: 'Can you explain the difference between virtual DOM and real DOM in React?',
  },
  {
    id: 2,
    category: 'System Design',
    question: 'How would you design a rate limiter for a public API?',
  },
  {
    id: 3,
    category: 'Behavioral',
    question: 'Tell me about a time you had a disagreement with a team member. How did you resolve it?',
  },
  {
    id: 4,
    category: 'Problem Solving',
    question: 'Given an array of integers, how would you find the two numbers that add up to a specific target?',
  }
];

export default function InterviewSessionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { questions: aiQuestions = [], interviewId, role, difficulty } = location.state || {};

  const interviewQuestions = aiQuestions.length > 0 
    ? aiQuestions.map((q, idx) => ({ id: idx + 1, category: 'AI Generated', question: q.question })) 
    : MOCK_QUESTIONS;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const messagesEndRef = useRef(null);
  const webcamAnalysisStartedRef = useRef(false);

  const {
    videoRef,
    canvasRef,
    isWebcamActive,
    isModelLoading,
    isAnalyzing,
    currentMetrics,
    allSnapshots,
    aggregateMetrics,
    webcamStream,
    toggleWebcam,
    startAnalysis,
    stopAnalysis,
  } = useWebcamAnalysis();

  const currentQuestion = interviewQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === interviewQuestions.length - 1;

  // Timer
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentQuestionIndex, answers]);

  const [shouldAutoRecord, setShouldAutoRecord] = useState(false);
  const spokenQuestionRef = useRef(null);

  // Reset auto-record flag when question changes
  useEffect(() => {
    setShouldAutoRecord(false);
  }, [currentQuestionIndex]);

  // Text-to-Speech logic
  useEffect(() => {
    if (!currentQuestion || isFinished) return;
    
    if (isMuted) {
      // If muted, we don't speak, so we just allow them to manually record or auto-record immediately
      // depending on preference. Let's not auto-record immediately if muted to avoid jump scares.
      return;
    }

    // Prevent double-firing from React StrictMode or re-renders
    if (spokenQuestionRef.current === currentQuestion.id) {
      return;
    }
    spokenQuestionRef.current = currentQuestion.id;

    window.speechSynthesis.cancel(); // Stop any previous speech
    const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Try to find a good English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha') || v.lang === 'en-US');
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => {
      setShouldAutoRecord(true);
      // Start webcam analysis on the first question's TTS end
      if (isWebcamActive && !webcamAnalysisStartedRef.current) {
        webcamAnalysisStartedRef.current = true;
        startAnalysis();
      }
    };
    // If it errors or gets cancelled, don't force auto-record just in case

    // Keep utterance in a global variable so Chrome doesn't garbage collect it mid-sentence
    window._currentUtterance = utterance;

    window.speechSynthesis.speak(utterance);
  }, [currentQuestionIndex, isMuted, currentQuestion, isFinished]);

  const handleNextQuestion = async () => {
    setIsSubmitting(true);
    const answerToSubmit = currentAnswer;
    
    // Save locally instantly to render in chat
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerToSubmit
    }));

    const submitPromise = (async () => {
      try {
        const token = localStorage.getItem('amie_token');
        const response = await fetch('/api/sessions/answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            interviewId,
            question: currentQuestion.question,
            userAnswer: answerToSubmit
          })
        });

        if (!response.ok) throw new Error('Failed to submit answer');
      } catch (error) {
        console.error('Failed to submit answer to backend:', error);
      }
    })();

    if (isLastQuestion) {
      await submitPromise;
      setIsSubmitting(false);
      handleFinish();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer(answers[interviewQuestions[currentQuestionIndex + 1]?.id] || '');
      setLiveTranscript('');
      setIsSubmitting(false);
    }
  };

  const handleVoiceSubmit = async (audioBlob, durationSeconds) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('amie_token');
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'answer.webm');
      
      const transcribeRes = await fetch('/api/voice/transcribe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!transcribeRes.ok) throw new Error('Failed to transcribe audio');
      const { transcript } = await transcribeRes.json();
      
      // Save locally to render in chat
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: transcript
      }));

      const submitPromise = (async () => {
        try {
          const evalRes = await fetch('/api/voice/evaluate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              interviewId,
              question: currentQuestion.question,
              transcript,
              durationSeconds
            })
          });
          if (!evalRes.ok) throw new Error('Failed to evaluate voice answer');
        } catch (error) {
          console.error('Voice eval error:', error);
        }
      })();

      if (isLastQuestion) {
        await submitPromise;
        setIsSubmitting(false);
        handleFinish();
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
        setCurrentAnswer(answers[interviewQuestions[currentQuestionIndex + 1]?.id] || '');
        setLiveTranscript('');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error handling voice submit:', error);
      setIsSubmitting(false);
      alert('Error processing voice recording. Please try again.');
    }
  };

  const handleFinish = async () => {
    window.speechSynthesis.cancel();
    setIsRunning(false);
    setIsFinished(true);

    // Stop webcam analysis and save behavioral report
    let behaviorSaved = false;
    if (isAnalyzing || webcamAnalysisStartedRef.current) {
      try {
        const finalMetrics = stopAnalysis();
        if (finalMetrics && interviewId) {
          const token = localStorage.getItem('amie_token');
          await fetch('/api/webcam/save-report', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              interviewId,
              metrics: {
                ...finalMetrics,
                snapshots: allSnapshots,
              },
            }),
          });
          behaviorSaved = true;
        }
      } catch (err) {
        console.error('Failed to save behavioral report:', err);
      }
    }

    try {
      const token = localStorage.getItem('amie_token');
      await fetch(`/api/interviews/${interviewId}/finish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ duration: seconds })
      });
    } catch (err) {
      console.error('Failed to finish interview:', err);
    }

    setTimeout(() => {
      navigate('/interview/result', {
        state: { timeElapsed: seconds, interviewId, hasBehaviorReport: behaviorSaved },
      });
    }, 1500);
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in text-center">
        <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-surface-100 mb-2">Analyzing Your Performance</h2>
        <p className="text-surface-400">Our AI is generating detailed feedback and scores...</p>
      </div>
    );
  }

  // Generate Chat Feed from history
  const chatFeed = [];
  for (let i = 0; i <= currentQuestionIndex; i++) {
    const q = interviewQuestions[i];
    chatFeed.push({ id: `q-${q.id}`, role: 'ai', text: q.question });
    if (answers[q.id]) {
      chatFeed.push({ id: `a-${q.id}`, role: 'user', text: answers[q.id] });
    } else if (i === currentQuestionIndex && liveTranscript) {
      chatFeed.push({ id: `live-a-${q.id}`, role: 'user', text: liveTranscript });
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] animate-fade-in p-4 sm:p-6 lg:p-8 pb-24 lg:pb-6">
      {/* Fixed Header */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-800">
        <div className="flex items-center gap-4">
          <InterviewTimer seconds={seconds} isRunning={isRunning} />
          <Badge variant="info" dot>{role || 'Software Engineer'}</Badge>
          <Badge variant="warning">{difficulty || 'Medium'}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            icon={isWebcamActive ? <Camera size={16} /> : <CameraOff size={16} />}
            onClick={toggleWebcam}
          >
            {isWebcamActive ? 'Cam On' : 'Cam Off'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            icon={isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            onClick={() => {
              setIsMuted(!isMuted);
              if (!isMuted) window.speechSynthesis.cancel();
            }}
          >
            {isMuted ? 'Unmute AI' : 'Mute AI'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<StopCircle size={16} />}
            onClick={() => {
              window.speechSynthesis.cancel();
              if (isAnalyzing) stopAnalysis();
              navigate('/dashboard');
            }}
          >
            End Early
          </Button>
        </div>
      </div>

      {/* Webcam Preview PIP */}
      <WebcamPreview
        videoRef={videoRef}
        canvasRef={canvasRef}
        stream={webcamStream}
        isWebcamActive={isWebcamActive}
        isModelLoading={isModelLoading}
        isAnalyzing={isAnalyzing}
        currentMetrics={currentMetrics}
        onToggle={toggleWebcam}
      />

      {/* Scrollable Chat Feed Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth">
        <div className="text-center text-sm text-surface-400 mb-8">
          The interview has started. The AI will ask you questions one by one.
        </div>
        
        {chatFeed.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        
        {/* Invisible div to scroll to */}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Fixed Bottom Input Area */}
      <div className="flex-shrink-0 w-full mt-auto">
        <AnswerInput 
          value={currentAnswer}
          onChange={setCurrentAnswer}
          onSubmit={handleNextQuestion}
          onVoiceSubmit={handleVoiceSubmit}
          isLastQuestion={isLastQuestion}
          disabled={false}
          isSubmitting={isSubmitting}
          shouldAutoRecord={shouldAutoRecord}
          onLiveTranscriptChange={setLiveTranscript}
          className="rounded-t-2xl shadow-2xl"
        />
      </div>
    </div>
  );
}
