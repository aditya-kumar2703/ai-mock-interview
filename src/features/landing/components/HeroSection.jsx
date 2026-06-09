import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui';
import Section from '../../../components/layout/Section';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <Section 
      className="relative overflow-hidden" 
      padding="2xl"
      innerClassName="text-center relative z-10"
      aria-label="Hero"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 mesh-gradient opacity-40 pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary-500/15 rounded-full blur-[100px] animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-accent-500/15 rounded-full blur-[100px] animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Eyebrow badge */}
      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8 animate-fade-in backdrop-blur-md">
        <Sparkles size={16} className="text-primary-400" />
        <span className="text-sm font-semibold tracking-wide text-primary-400 uppercase">Next-Gen AI Mock Interviews</span>
      </div>

      {/* Headline */}
      <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-extrabold tracking-tighter leading-[1.1] mb-8 animate-fade-in-up">
        <span className="text-surface-50">Master Your Next</span>
        <br />
        <span className="text-gradient drop-shadow-sm">Tech Interview</span>
      </h1>

      {/* Subheadline */}
      <p className="text-xl sm:text-2xl text-surface-300 font-light max-w-3xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        Simulate highly realistic coding and behavioral interviews with advanced AI. 
        Get instant, actionable feedback and land your dream job faster.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <Button to="/register" variant="accent" className="px-8 py-4 text-lg rounded-full font-semibold shadow-glow-lg">
          Start Practicing Free <ArrowRight size={20} />
        </Button>
        <Button to="/login" variant="secondary" className="px-8 py-4 text-lg rounded-full font-medium border-surface-600 bg-surface-800/50 backdrop-blur-md hover:bg-surface-800">
          View Sample Report
        </Button>
      </div>
    </Section>
  );
}
