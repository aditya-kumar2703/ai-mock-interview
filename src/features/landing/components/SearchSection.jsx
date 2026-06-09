import { Search } from 'lucide-react';
import { Button } from '../../../components/ui';

export default function SearchSection() {
  return (
    <section className="relative max-w-3xl mx-auto px-6 sm:px-8 -mt-10 z-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="bg-surface-900/90 backdrop-blur-2xl border border-surface-700/80 p-2 sm:p-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex items-center gap-3">
        <div className="flex-1 flex items-center gap-4 px-4">
          <Search size={22} className="text-surface-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search for a role (e.g. Frontend, Data Scientist)" 
            className="w-full bg-transparent border-none text-surface-100 placeholder:text-surface-500 font-medium focus:outline-none focus:ring-0 text-base sm:text-lg"
          />
        </div>
        <Button variant="primary" className="hidden sm:flex shrink-0 px-8 py-3.5 rounded-full text-base">
          Find Interviews
        </Button>
      </div>
      <div className="flex sm:hidden mt-4">
        <Button variant="primary" fullWidth className="rounded-full py-3.5 text-base">
          Find Interviews
        </Button>
      </div>
    </section>
  );
}
