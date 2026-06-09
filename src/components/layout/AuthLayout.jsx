import { Outlet } from 'react-router-dom';
import Logo from '../shared/Logo';

/**
 * AuthLayout — centered card on animated gradient background.
 * Used for /login and /register routes.
 */
export default function AuthLayout() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Animated mesh background */}
      <div className="absolute inset-0 mesh-gradient opacity-40 pointer-events-none" />
      <div className="absolute inset-0 gradient-surface opacity-80 pointer-events-none" />

      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/15 rounded-full blur-[100px] animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-500/15 rounded-full blur-[100px] animate-float pointer-events-none" style={{ animationDelay: '3s' }} />

      {/* Auth card */}
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Card */}
        <div className="bg-surface-900/60 backdrop-blur-2xl border border-surface-700/80 rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
          <Outlet />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-surface-500 mt-6">
          © 2025 AMIE. All rights reserved.
        </p>
      </div>
    </div>
  );
}
