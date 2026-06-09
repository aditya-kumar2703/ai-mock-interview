import { Card, ProgressBar } from '../../../components/ui';

/**
 * Overall progress tracker for practice plan.
 */
export default function ProgressTracker({ className }) {
  return (
    <Card variant="glass" className={className}>
      <h3 className="text-sm font-medium text-surface-400 mb-3">Overall Progress</h3>
      <div className="flex items-end gap-3 mb-4">
        <span className="text-4xl font-bold text-gradient">0%</span>
      </div>
      <ProgressBar value={0} max={100} color="primary" animated />
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-surface-800">
        <div className="text-center">
          <p className="text-lg font-bold text-surface-200">0</p>
          <p className="text-xs text-surface-500">Completed</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-surface-200">0</p>
          <p className="text-xs text-surface-500">In Progress</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-surface-200">0</p>
          <p className="text-xs text-surface-500">Remaining</p>
        </div>
      </div>
    </Card>
  );
}
