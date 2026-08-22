import React, { useMemo, useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon, InboxIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
  align?: 'left' | 'right';
  className?: string;
  hideBelow?: 'sm' | 'md' | 'lg' | 'xl';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  emptyLabel?: string;
}

const hideClasses: Record<string, string> = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
  xl: 'hidden xl:table-cell'
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  pageSize = 8,
  emptyLabel = 'Nothing to show yet'
}: DataTableProps<T>) {
  const [sort, setSort] = useState<{key: string;dir: 'asc' | 'desc';} | null>(null);
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const column = columns.find((c) => c.key === sort.key);
    if (!column?.sortValue) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = column.sortValue!(a);
      const bv = column.sortValue!(b);
      if (typeof av === 'number' && typeof bv === 'number') {
        return sort.dir === 'asc' ? av - bv : bv - av;
      }
      return sort.dir === 'asc' ?
      String(av).localeCompare(String(bv)) :
      String(bv).localeCompare(String(av));
    });
    return copy;
  }, [rows, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, totalPages);
  const visible = sorted.slice((current - 1) * pageSize, current * pageSize);

  function toggleSort(key: string) {
    setSort((prev) => {
      if (prev?.key !== key) return { key, dir: 'desc' };
      if (prev.dir === 'desc') return { key, dir: 'asc' };
      return null;
    });
    setPage(1);
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line">
              {columns.map((column) => {
                const active = sort?.key === column.key;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    className={cn(
                      'px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted',
                      column.align === 'right' && 'text-right',
                      column.hideBelow && hideClasses[column.hideBelow]
                    )}>
                    
                    {column.sortValue ?
                    <button
                      onClick={() => toggleSort(column.key)}
                      className={cn(
                        'inline-flex items-center gap-1 transition-colors duration-150 ease-smooth hover:text-ink',
                        active && 'text-ink'
                      )}>
                      
                        {column.header}
                        {active ?
                      sort?.dir === 'asc' ?
                      <ArrowUpIcon className="h-3 w-3" /> :

                      <ArrowDownIcon className="h-3 w-3" /> :

                      null}
                      </button> :

                    column.header
                    }
                  </th>);

              })}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) =>
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                'border-b border-line/70 last:border-0',
                onRowClick && 'cursor-pointer transition-colors duration-150 ease-smooth hover:bg-faint'
              )}>
              
                {columns.map((column) =>
              <td
                key={column.key}
                className={cn(
                  'px-5 py-3 align-middle text-ink',
                  column.align === 'right' && 'text-right',
                  column.hideBelow && hideClasses[column.hideBelow],
                  column.className
                )}>
                
                    {column.render(row)}
                  </td>
              )}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {visible.length === 0 ?
      <div className="flex flex-col items-center gap-2 px-5 py-14 text-center">
          <InboxIcon className="h-6 w-6 text-muted" />
          <p className="text-sm font-medium text-ink">{emptyLabel}</p>
          <p className="text-[13px] text-muted">Try adjusting your search or filters.</p>
        </div> :
      null}

      {sorted.length > pageSize ?
      <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3">
          <p className="text-[13px] text-muted">
            {(current - 1) * pageSize + 1}–{Math.min(current * pageSize, sorted.length)} of{' '}
            {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            <button
            onClick={() => setPage(current - 1)}
            disabled={current === 1}
            aria-label="Previous page"
            className="rounded-lg border border-line p-1.5 text-muted transition-colors duration-150 ease-smooth hover:bg-faint hover:text-ink disabled:opacity-40">
            
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <span className="px-2 text-[13px] font-medium text-ink">
              {current} / {totalPages}
            </span>
            <button
            onClick={() => setPage(current + 1)}
            disabled={current === totalPages}
            aria-label="Next page"
            className="rounded-lg border border-line p-1.5 text-muted transition-colors duration-150 ease-smooth hover:bg-faint hover:text-ink disabled:opacity-40">
            
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div> :
      null}
    </div>);

}