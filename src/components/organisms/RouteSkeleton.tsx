import React from 'react';
import { Skeleton } from '@/components/atoms/Skeleton';

/** Route-chunk fallback shaped like the common page layout: top bar, title block, card grid. */
export const RouteSkeleton: React.FC = () => (
  <div className="min-h-screen bg-canvas" aria-busy="true">
    <span role="status" className="sr-only">Loading page</span>
    <div className="flex h-16 items-center justify-between border-b border-line px-4 sm:px-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-9 w-24" />
    </div>
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-2/3 max-w-md" />
        <Skeleton className="h-4 w-1/2 max-w-sm" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
    </div>
  </div>
);
