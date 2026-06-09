import { Mic, FileText, BarChart3, Target, Shield, Zap } from 'lucide-react';
import Section from '../../../components/layout/Section';

const features = [
  {
    icon: <Mic size={24} />,
    title: 'Voice-Interactive AI',
    description: 'Speak your answers naturally. Our AI listens, transcribes, and responds in real-time, just like a human interviewer.',
  },
  {
    icon: <FileText size={24} />,
    title: 'Resume-Tailored Questions',
    description: 'Upload your resume and the AI will generate personalized questions based on your specific experience and listed skills.',
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Deep Analytics',
    description: 'Get a comprehensive breakdown of your performance across technical accuracy, communication, and confidence metrics.',
  },
  {
    icon: <Target size={24} />,
    title: 'Adaptive Difficulty',
    description: 'The AI adjusts the difficulty of follow-up questions based on how well you answer, simulating a real progressive interview.',
  },
  {
    icon: <Shield size={24} />,
    title: 'Private & Secure',
    description: 'Your practice sessions are private. Audio and transcripts are securely stored and only accessible by you.',
  },
  {
    icon: <Zap size={24} />,
    title: 'Instant Feedback',
    description: 'No more waiting for rejection emails. Get immediate, actionable feedback on exactly what to improve after every answer.',
  },
];

export default function FeaturesSection() {
  return (
    <Section 
      id="features" 
      className="bg-surface-900 border-y border-surface-800" 
      padding="xl"
      aria-label="Features"
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-surface-100 mb-4">
          Everything You Need to Ace It
        </h2>
        <p className="text-surface-400 max-w-2xl mx-auto">
          Our platform provides a complete ecosystem to prepare you for the toughest technical interviews.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <div
            key={feature.title}
            className="group p-8 rounded-3xl bg-surface-950 border border-surface-800 hover:border-primary-500/30 hover:shadow-glow transition-default animate-fade-in-up relative overflow-hidden"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {/* Decorative background glow on hover */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-default" />
            
            <div className="relative z-10">
              <div className="p-3 w-fit rounded-xl bg-primary-500/10 text-primary-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-surface-100 mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-surface-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
