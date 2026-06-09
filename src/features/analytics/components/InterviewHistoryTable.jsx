import { Card, Table, Badge, Button } from '../../../components/ui';
import { ChevronRight, FileText } from 'lucide-react';
import { cn } from '../../../lib/utils';

/**
 * Historical table of mock interviews for Analytics page.
 */
export default function InterviewHistoryTable({ className, historyData = [] }) {

  const columns = [
    { header: 'Date', accessorKey: 'date' },
    { header: 'Target Role', accessorKey: 'role' },
    { 
      header: 'Category', 
      cell: (row) => (
        <Badge variant={row.type === 'Technical' ? 'primary' : row.type === 'System Design' ? 'accent' : 'neutral'} size="sm">
          {row.type}
        </Badge>
      )
    },
    { header: 'Duration', accessorKey: 'duration' },
    { 
      header: 'Score', 
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Badge variant={row.score >= 80 ? 'success' : row.score >= 65 ? 'warning' : 'danger'}>
            {row.score}%
          </Badge>
        </div>
      )
    },
    {
      header: '',
      cell: () => (
        <Button variant="ghost" size="sm" className="text-surface-400 hover:text-primary-400">
          View Report <ChevronRight size={14} />
        </Button>
      )
    }
  ];

  return (
    <Card className={cn('p-0 overflow-hidden', className)}>
      <div className="p-6 border-b border-surface-800 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-surface-100 flex items-center gap-2">
            <FileText size={20} className="text-primary-400" />
            Interview History
          </h3>
          <p className="text-sm text-surface-400 mt-1">Review your past sessions and track improvement over time.</p>
        </div>
      </div>
      
      {historyData.length === 0 ? (
        <div className="p-8 text-center text-surface-400">
          No mock interviews completed yet. Check back after your first session!
        </div>
      ) : (
        <Table columns={columns} data={historyData} />
      )}
      
      <div className="p-4 border-t border-surface-800 flex justify-center">
        <Button variant="ghost" size="sm">
          Load More History
        </Button>
      </div>
    </Card>
  );
}
