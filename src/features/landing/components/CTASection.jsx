import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 bg-surface-950" aria-label="Call to action">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] overflow-hidden gradient-primary p-12 lg:p-20 text-center shadow-glow-lg">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute inset-0 mesh-gradient mix-blend-overlay" />
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to land your dream job?
            </h2>
            <p className="text-xl text-white/80 mb-10 font-medium">
              Join thousands of professionals who have transformed their interview performance with AMIE. Start practicing today, for free.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                to="/register"
                variant="secondary" 
                size="lg" 
                className="bg-white text-primary-700 hover:bg-surface-50 border-0 shadow-lg font-bold"
              >
                Create Free Account <ArrowRight size={18} />
              </Button>
              <p className="text-sm text-white/60 mt-4 sm:mt-0 sm:ml-4">
                No credit card required
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
