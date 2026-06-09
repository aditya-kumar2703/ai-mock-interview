import { useState } from 'react';
import PageHeader from '../../../components/shared/PageHeader';
import ResumeUploader from '../components/ResumeUploader';
import ResumeScoreCard from '../components/ResumeScoreCard';
import ResumeFeedbackList from '../components/ResumeFeedbackList';
import { Button } from '../../../components/ui';
import { FileText, Download } from 'lucide-react';

/**
 * Resume Analysis page.
 */
export default function ResumeAnalysisPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [score, setScore] = useState(0);
  const [skills, setSkills] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const handleUpload = async (file) => {
    setIsUploading(true);
    
    try {
      const token = localStorage.getItem('amie_token');
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Do NOT set Content-Type header when using FormData; the browser sets it automatically with the boundary.
        },
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = 'Failed to analyze resume';
        try {
          const errData = await response.json();
          if (errData.message) errorMsg = errData.message;
        } catch (e) {}
        throw new Error(errorMsg);
      }

      const data = await response.json();
      
      setScore(data.score);
      setSkills(data.skills);
      setFeedbacks(data.feedback);
      setIsAnalyzed(true);
    } catch (error) {
      console.error('Upload Error:', error);
      alert(error.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <PageHeader
        title="Resume Analysis"
        subtitle="Upload your resume and get AI-powered feedback to improve it"
        actions={
          isAnalyzed && (
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" icon={<Download size={16} />}>
                Export PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsAnalyzed(false)}>
                Analyze Another
              </Button>
            </div>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ResumeUploader 
            isUploading={isUploading} 
            isAnalyzed={isAnalyzed}
            onUpload={handleUpload}
          />
          <ResumeFeedbackList isAnalyzed={isAnalyzed} feedbacks={feedbacks} />
        </div>
        <div>
          <ResumeScoreCard isAnalyzed={isAnalyzed} score={score} skills={skills} className="sticky top-24" />
        </div>
      </div>
    </div>
  );
}
