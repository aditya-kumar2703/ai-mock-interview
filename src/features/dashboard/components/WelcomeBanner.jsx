import { useAuth } from '../../../hooks/useAuth';
import { Sparkles, ArrowRight, Target, Zap } from 'lucide-react';
import { Card, Button } from '../../../components/ui';
import { cn } from '../../../lib/utils';

/**
 * Welcome banner for the dashboard.
 */
export default function WelcomeBanner({ className }) {
  // Try to parse email from token if possible, otherwise generic
  let userName = "there";
  try {
    const token = localStorage.getItem('amie_token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.email) {
        userName = payload.email.split('@')[0];
        // Capitalize first letter
        userName = userName.charAt(0).toUpperCase() + userName.slice(1);
      }
    }
  } catch (e) {
    // ignore
  }

  return (
    <Card variant="glass" className={cn('relative overflow-hidden p-6 lg:p-8', className)}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-white/80" />
            <span className="text-xs font-medium text-white/80 uppercase tracking-wider">
              Welcome Back
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-1">
            Hello, {userName}! 👋
          </h2>
          <p className="text-white/70 text-sm">
            Ready for your next practice session? Your AI coach is standing by.
          </p>
        </div>
        <Button
          variant="secondary"
          size="lg"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm shrink-0"
        >
          Start Interview <ArrowRight size={16} />
        </Button>
      </div>
    </Card>
  );
}
