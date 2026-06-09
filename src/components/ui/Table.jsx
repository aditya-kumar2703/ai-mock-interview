import { cn } from '../../lib/utils';

/**
 * Table component with modern SaaS styling.
 * 
 * @param {Object} props
 * @param {Array} props.columns - Array of { key, title, render }
 * @param {Array} props.data - Array of data objects
 * @param {boolean} props.hoverable - Whether rows should highlight on hover
 */
export default function Table({
  columns = [],
  data = [],
  hoverable = true,
  className,
}) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-xl border border-surface-800 bg-surface-900/50 shadow-sm", className)}>
      <table className="w-full text-left text-sm text-surface-300">
        <thead className="bg-surface-800/50 text-xs uppercase text-surface-400 border-b border-surface-800">
          <tr>
            {columns.map((col, i) => (
              <th key={col.key || i} className="px-6 py-4 font-medium tracking-wider">
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-800/50">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr 
                key={row.id || rowIndex} 
                className={cn(
                  "transition-default", 
                  hoverable && "hover:bg-surface-800/30"
                )}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-surface-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
