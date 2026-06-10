import { Card, ProgressBar } from '../../../components/ui';
import { Eye, Shield, Activity, Smile, ArrowUp, Lightbulb } from 'lucide-react';

/**
 * Behavioral analysis report dashboard card.
 */
export default function BehaviorReport({ report }) {
  if (!report) return null;

  const sections = [
    {
      title: 'Overall Confidence',
      score: report.confidenceScore,
      feedback: report.confidenceFeedback,
      icon: <Shield size={20} />,
      color: 'primary',
      gradient: 'from-primary-500/20 to-transparent',
    },
    {
      title: 'Eye Contact',
      score: report.eyeContactScore,
      feedback: report.eyeContactFeedback,
      icon: <Eye size={20} />,
      color: 'accent',
      gradient: 'from-accent-500/20 to-transparent',
      extra: (
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div className="bg-surface-800/60 rounded-xl p-3 text-center">
            <p className="text-xs text-surface-400 mb-0.5">Screen Focus</p>
            <p className="text-lg font-bold text-success-500">{report.screenFocusPercentage}%</p>
          </div>
          <div className="bg-surface-800/60 rounded-xl p-3 text-center">
            <p className="text-xs text-surface-400 mb-0.5">Looking Away</p>
            <p className="text-lg font-bold text-warning-500">{report.lookingAwayPercentage}%</p>
          </div>
          <div className="bg-surface-800/60 rounded-xl p-3 text-center">
            <p className="text-xs text-surface-400 mb-0.5">Max Distraction</p>
            <p className="text-lg font-bold text-danger-500">{report.longestDistractionSeconds}s</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Body Language',
      score: report.bodyLanguageScore,
      feedback: report.bodyLanguageFeedback,
      icon: <Activity size={20} />,
      color: 'success',
      gradient: 'from-success-500/20 to-transparent',
    },
    {
      title: 'Engagement',
      score: report.engagementScore,
      feedback: report.engagementFeedback,
      icon: <ArrowUp size={20} />,
      color: 'warning',
      gradient: 'from-warning-500/20 to-transparent',
    },
    {
      title: 'Smile Analysis',
      score: report.smileScore,
      feedback: report.smileFrequency > 0
        ? `You smiled ${report.smileFrequency} time${report.smileFrequency !== 1 ? 's' : ''} with an average duration of ${report.averageSmileDuration}s. ${report.smileScore >= 60 ? 'Natural smile frequency indicates positive engagement.' : 'Consider smiling more naturally to build rapport.'}`
        : 'No smiles were detected. A natural smile at appropriate moments helps build rapport with the interviewer.',
      icon: <Smile size={20} />,
      color: 'accent',
      gradient: 'from-accent-500/20 to-transparent',
    },
  ];

  const getLabel = (score) => {
    if (score >= 80) return { text: 'Excellent', color: 'text-success-500' };
    if (score >= 60) return { text: 'Good', color: 'text-primary-500' };
    if (score >= 40) return { text: 'Needs Improvement', color: 'text-warning-500' };
    return { text: 'Weak', color: 'text-danger-500' };
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-surface-100 mb-6 flex items-center gap-2">
        <Shield size={20} className="text-primary-500" />
        Behavioral Analysis Report
      </h3>

      <div className="space-y-6">
        {sections.map((section) => {
          const label = getLabel(section.score);
          return (
            <div key={section.title} className={`rounded-xl p-5 bg-gradient-to-r ${section.gradient} border border-surface-800/60`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-${section.color}-500/15 text-${section.color}-500`}>
                    {section.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-surface-200">{section.title}</h4>
                    <span className={`text-xs font-medium ${label.color}`}>{label.text}</span>
                  </div>
                </div>
                <span className="text-2xl font-bold text-surface-100">{section.score}%</span>
              </div>

              <ProgressBar value={section.score} max={100} color={section.color} size="sm" />

              <p className="text-xs text-surface-400 mt-3 leading-relaxed">
                {section.feedback}
              </p>

              {section.extra}
            </div>
          );
        })}
      </div>

      {/* Improvement Suggestions */}
      {report.suggestions && report.suggestions.length > 0 && (
        <div className="mt-8 p-5 rounded-xl bg-surface-800/40 border border-surface-700/50">
          <h4 className="text-sm font-semibold text-surface-200 mb-4 flex items-center gap-2">
            <Lightbulb size={16} className="text-warning-500" />
            Improvement Suggestions
          </h4>
          <ul className="space-y-2.5">
            {report.suggestions.map((suggestion, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-surface-400">
                <span className="text-warning-500 mt-0.5 shrink-0">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
