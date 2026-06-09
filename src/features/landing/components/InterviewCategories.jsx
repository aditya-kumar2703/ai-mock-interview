import { Code2, PenTool, Database, MonitorSmartphone, Server, Shield } from 'lucide-react';
import { Card } from '../../../components/ui';

const categories = [
  { icon: <MonitorSmartphone size={24} />, name: 'Frontend Engineer', count: '150+ Scenarios' },
  { icon: <Server size={24} />, name: 'Backend Engineer', count: '200+ Scenarios' },
  { icon: <Database size={24} />, name: 'Data Scientist', count: '120+ Scenarios' },
  { icon: <PenTool size={24} />, name: 'UI/UX Designer', count: '80+ Scenarios' },
  { icon: <Code2 size={24} />, name: 'Full Stack Engineer', count: '250+ Scenarios' },
  { icon: <Shield size={24} />, name: 'Security Engineer', count: '90+ Scenarios' },
];

export default function InterviewCategories() {
  return (
    <section id="categories" className="py-24 sm:py-32 bg-surface-950" aria-label="Interview Categories">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-surface-100 mb-6">
            Practice for Any Role
          </h2>
          <p className="text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto font-light">
            Our AI models are specialized in technical and behavioral questions across the entire tech stack.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-5xl mx-auto">
          {categories.map((category, i) => (
            <div 
              key={category.name} 
              className="flex items-center gap-3 px-5 sm:px-6 py-3 sm:py-4 rounded-full bg-surface-900 border border-surface-800 hover:border-primary-500/40 hover:bg-surface-800/80 cursor-pointer group animate-fade-in-up transition-default"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-surface-400 group-hover:text-primary-400 transition-default">
                {category.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-semibold text-surface-200 group-hover:text-surface-50 transition-default">
                  {category.name}
                </span>
                <span className="text-[10px] sm:text-xs text-surface-500 font-medium tracking-wide uppercase">
                  {category.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
