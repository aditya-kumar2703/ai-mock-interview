import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui';

export default function AdjustPlanModal({ isOpen, onClose, onGenerate }) {
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [targetCompany, setTargetCompany] = useState('');
  const [pace, setPace] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    await onGenerate({ targetRole, targetCompany, pace });
    setIsGenerating(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-surface-900 border border-surface-800 rounded-3xl p-6 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-surface-100">Adjust Practice Plan</h2>
          <button 
            onClick={onClose}
            className="p-2 text-surface-400 hover:text-surface-200 hover:bg-surface-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Target Role</label>
            <input 
              type="text" 
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-surface-950 border border-surface-800 rounded-xl px-4 py-2.5 text-surface-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              placeholder="e.g. Frontend Developer, Data Scientist"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Target Company (Optional)</label>
            <input 
              type="text" 
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              className="w-full bg-surface-950 border border-surface-800 rounded-xl px-4 py-2.5 text-surface-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              placeholder="e.g. Google, Stripe, Startups"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Preparation Pace</label>
            <select 
              value={pace}
              onChange={(e) => setPace(Number(e.target.value))}
              className="w-full bg-surface-950 border border-surface-800 rounded-xl px-4 py-2.5 text-surface-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all appearance-none"
            >
              <option value={2}>Fast Track (2 Weeks)</option>
              <option value={4}>Standard (4 Weeks)</option>
              <option value={8}>Comprehensive (8 Weeks)</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose} disabled={isGenerating}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={isGenerating}>
              {isGenerating ? <><Loader2 size={16} className="animate-spin mr-2" /> Generating</> : 'Regenerate Plan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
