import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    />
  );
};

export const GigCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-brand-dark-card rounded-[1.5rem] p-6 border border-brand-gray dark:border-white/5 shadow-sm flex flex-col h-full min-h-[280px]">
      <div className="flex justify-between items-start mb-4">
        <Skeleton className="w-16 h-5 rounded-full" />
        <Skeleton className="w-20 h-7 rounded-lg" />
      </div>
      
      <div className="mb-4">
        <Skeleton className="w-3/4 h-6 mb-3" />
        <div className="flex gap-3">
          <Skeleton className="w-20 h-4 rounded-lg" />
          <Skeleton className="w-20 h-4 rounded-lg" />
        </div>
      </div>
      
      <div className="space-y-2 mb-6">
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-4/5 h-3" />
      </div>
      
      <div className="mt-auto pt-4 border-t border-brand-gray dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-20 h-3" />
        </div>
        <Skeleton className="w-16 h-8 rounded-xl" />
      </div>
    </div>
  );
};

export const UserCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-brand-dark-card rounded-xl p-5 border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
        <div className="flex-1">
          <Skeleton className="w-32 h-6 mb-2" />
          <Skeleton className="w-24 h-4" />
        </div>
      </div>
      
      <div className="mt-4 flex gap-2">
        <Skeleton className="w-16 h-6 rounded-full" />
        <Skeleton className="w-16 h-6 rounded-full" />
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
    </div>
  );
};
