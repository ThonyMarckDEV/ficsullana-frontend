import React from 'react';

const SkeletonLine = ({ className = '' }) => (
  <span
    aria-hidden="true"
    className={`block h-3 rounded-full bg-slate-200 animate-pulse ${className}`}
  />
);

export const TableSkeletonRows = ({ rows = 3, columns = 4 }) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <tr key={`skeleton-row-${rowIndex}`}>
        {Array.from({ length: columns }).map((__, columnIndex) => (
          <td key={`skeleton-cell-${rowIndex}-${columnIndex}`} className="px-3 py-3">
            <SkeletonLine className={columnIndex === 0 ? 'w-12' : 'w-full max-w-[140px]'} />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export const BlockSkeleton = ({ rows = 4 }) => (
  <div aria-hidden="true" className="space-y-3">
    {Array.from({ length: rows }).map((_, index) => (
      <SkeletonLine
        key={`block-skeleton-${index}`}
        className={index % 3 === 0 ? 'w-2/3' : 'w-full'}
      />
    ))}
  </div>
);

export default SkeletonLine;
