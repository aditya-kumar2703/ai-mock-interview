import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Badge } from '../../../components/ui';
import InterviewTimer from '../components/InterviewTimer';
import QuestionPanel from '../components/QuestionPanel';
import AnswerInput from '../components/AnswerInput';
import AIFeedbackCard from '../components/AIFeedbackCard';
import { StopCircle, SkipForward } from 'lucide-react';

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

/**
 * Interview Session page — active interview with questions and answers.
 */
export default function InterviewSessionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { questions: aiQuestions = [], interviewId, role, difficulty } = location.state || {};

  // Use AI questions if available, otherwise fallback to mock questions
  const interviewQuestions = aiQuestions.length > 0 
    ? aiQuestions.map((q, idx) => ({ id: idx + 1, category: 'AI Generated', question: q.question })) 
    : MOCK_QUESTIONS;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = interviewQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === interviewQuestions.length - 1;

  // Timer logic
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleNextQuestion = async () => {
    setIsSubmitting(true);
    
    // Create the promise for submitting the answer
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
            userAnswer: currentAnswer
          })
        });

        if (!response.ok) throw new Error('Failed to submit answer');
      } catch (error) {
        console.error('Failed to submit answer to backend:', error);
      }
    })();

    // Save current answer locally instantly
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: currentAnswer
    }));

    if (isLastQuestion) {
      // If it's the last question, we must wait for the AI to finish grading before moving to results
      await submitPromise;
      setIsSubmitting(false);
      handleFinish();
    } else {
      // For all other questions, instantly advance the UI while the AI grades in the background!
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer(answers[interviewQuestions[currentQuestionIndex + 1]?.id] || '');
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (isLastQuestion) {
      handleFinish();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer(answers[interviewQuestions[currentQuestionIndex + 1]?.id] || '');
    }
  };

  const handleFinish = () => {
    setIsRunning(false);
    setIsFinished(true);
    setTimeout(() => {
      navigate('/interview/result', { state: { timeElapsed: seconds, interviewId } });
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Session header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <InterviewTimer seconds={seconds} isRunning={isRunning} />
          <Badge variant="info" dot>Frontend Developer</Badge>
          <Badge variant="warning">Medium</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            icon={<SkipForward size={16} />}
            onClick={handleSkip}
          >
            Skip
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<StopCircle size={16} />}
            onClick={() => navigate('/dashboard')}
          >
            End Early
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <QuestionPanel 
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={interviewQuestions.length}
            question={currentQuestion.question}
            category={currentQuestion.category}
          />
          <AnswerInput 
            value={currentAnswer}
            onChange={setCurrentAnswer}
            onSubmit={handleNextQuestion}
            isLastQuestion={isLastQuestion}
            disabled={false}
            isSubmitting={isSubmitting}
          />
        </div>
        <div>
          <AIFeedbackCard />
        </div>
      </div>
    </div>
  );
}
