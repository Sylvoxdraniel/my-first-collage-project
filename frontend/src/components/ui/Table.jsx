import { motion } from 'framer-motion';
import { HiOutlineChevronUp, HiOutlineChevronDown } from 'react-icons/hi';

function SkeletonRow({ columns }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-dark-700 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export default function Table({
  columns = [],
  data = [],
  loading = false,
  sortField,
  sortDirection,
  onSort,
  emptyMessage = 'No data found',
  rowKey = 'id',
}) {
  const handleSort = (field) => {
    if (!onSort || !field) return;
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(field, direction);
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <HiOutlineChevronUp className="w-4 h-4 text-primary-400" />
    ) : (
      <HiOutlineChevronDown className="w-4 h-4 text-primary-400" />
    );
  };

  return (
    <div className="overflow-x-auto rounded-xl glass">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-dark-700/50">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                className={`
                  px-6 py-4 text-xs font-semibold uppercase tracking-wider text-dark-400
                  ${col.sortable ? 'cursor-pointer hover:text-primary-400 select-none' : ''}
                `}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && renderSortIcon(col.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-700/30">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} columns={columns.length} />
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-dark-400">
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-12 h-12 text-dark-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p>{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <motion.tr
                key={row[rowKey] || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="hover:bg-dark-700/30 transition-colors duration-150"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-dark-200 whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
