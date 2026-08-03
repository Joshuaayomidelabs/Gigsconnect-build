import React from 'react';
import { Skeleton } from '../Skeleton';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full flex items-center p-4">
      <Skeleton className="w-14 h-14 rounded-full shrink-0" />
      <div className="ml-4 flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32 rounded-md" />
          <Skeleton className="h-4 w-12 rounded-md" />
        </div>
        <Skeleton className="h-4 w-48 rounded-md" />
      </div>
    </div>
  );
};
