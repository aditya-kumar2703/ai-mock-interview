import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/shared/PageHeader';
import { Card, Button, Select } from '../../../components/ui';
import RoleSelector from '../components/RoleSelector';
import DifficultyPicker from '../components/DifficultyPicker';
import { ArrowRight, Settings2 } from 'lucide-react';

/**
 * Interview Setup page — configure role, difficulty, etc.
 */
export default function InterviewSetupPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStartInterview = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('amie_token');
      
      // Map roles to basic tech stacks for the AI prompt
      const techStackMap = {
        'Frontend Developer': ['React', 'JavaScript', 'CSS', 'HTML'],
        'Backend Developer': ['Node.js', 'Express', 'MongoDB', 'SQL'],
        'Full Stack Developer': ['React', 'Node.js', 'MongoDB'],
        'Data Scientist': ['Python', 'Pandas', 'SQL', 'Machine Learning'],
        'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'CI/CD']
      };
      
      const techStack = techStackMap[selectedRole] || ['General Programming'];
      
      const response = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobRole: selectedRole,
          experienceLevel: difficulty,
          techStack: techStack
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate interview questions');
      }
      
      const data = await response.json();
      
      // Navigate to session and pass the generated questions
      navigate('/interview/session', { 
        state: { 
          interviewId: data.interviewId,
          questions: data.questions,
          role: selectedRole,
          difficulty: difficulty
        } 
      });
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to generate questions. Ensure backend is running and you are logged in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <PageHeader
        title="Interview Setup"
        subtitle="Configure your mock interview session"
        actions={
          <Button
            variant="accent"
            icon={<ArrowRight size={16} />}
            onClick={handleStartInterview}
            disabled={!selectedRole || !difficulty || isLoading}
            isLoading={isLoading}
          >
            {isLoading ? 'Generating AI Questions...' : 'Start Interview'}
          </Button>
        }
      />

      <Card>
        <h3 className="text-lg font-semibold text-surface-100 mb-1">
          Select Role
        </h3>
        <p className="text-sm text-surface-400 mb-4">
          Choose the position you're preparing for
        </p>
        <RoleSelector selected={selectedRole} onSelect={setSelectedRole} />
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-surface-100 mb-1">
          Difficulty Level
        </h3>
        <p className="text-sm text-surface-400 mb-4">
          Select the challenge level for your session
        </p>
        <DifficultyPicker selected={difficulty} onSelect={setDifficulty} />
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-surface-100 mb-4 flex items-center gap-2">
          <Settings2 size={18} className="text-surface-400" />
          Additional Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Number of Questions"
            options={[
              { value: '5', label: '5 Questions' },
              { value: '10', label: '10 Questions' },
              { value: '15', label: '15 Questions' },
            ]}
          />
          <Select
            label="Time Limit"
            options={[
              { value: '15', label: '15 Minutes' },
              { value: '30', label: '30 Minutes' },
              { value: '45', label: '45 Minutes' },
              { value: '60', label: '60 Minutes' },
            ]}
          />
        </div>
      </Card>
    </div>
  );
}
