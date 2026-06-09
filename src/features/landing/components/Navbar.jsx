import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui';
import Logo from '../../../components/shared/Logo';
import { ArrowRight, Menu } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../../lib/utils';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface-950/80 backdrop-blur-lg border-b border-surface-800/50">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        <Logo size="md" />
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-surface-300 hover:text-surface-100 transition-default">Features</a>
          <a href="#categories" className="text-sm font-medium text-surface-300 hover:text-surface-100 transition-default">Roles</a>
          <a href="#pricing" className="text-sm font-medium text-surface-300 hover:text-surface-100 transition-default">Pricing</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button to="/login" variant="ghost" size="sm">Log In</Button>
          <Button to="/register" variant="accent" size="sm">
            Get Started <ArrowRight size={14} />
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-surface-300"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-surface-800 bg-surface-950 px-4 py-4 space-y-4 animate-fade-in-up">
          <nav className="flex flex-col gap-4">
            <a href="#features" className="text-sm font-medium text-surface-300">Features</a>
            <a href="#categories" className="text-sm font-medium text-surface-300">Roles</a>
            <a href="#pricing" className="text-sm font-medium text-surface-300">Pricing</a>
          </nav>
          <div className="flex flex-col gap-3 pt-4 border-t border-surface-800">
            <Button to="/login" variant="ghost" size="md" fullWidth>Log In</Button>
            <Button to="/register" variant="accent" size="md" fullWidth>Get Started</Button>
          </div>
        </div>
      )}
    </header>
  );
}
