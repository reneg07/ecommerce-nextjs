import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ProductDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <Skeleton className="h-3.5 w-14" />
        <span className="text-slate-300">/</span>
        <Skeleton className="h-3.5 w-16" />
        <span className="text-slate-300">/</span>
        <Skeleton className="h-3.5 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Image Skeleton */}
        <div className="p-8 rounded-xl bg-white border border-slate-200">
          <Skeleton className="w-full aspect-square rounded-lg" />
        </div>

        {/* Right: Info Skeleton */}
        <div className="p-8 rounded-xl bg-white border border-slate-200 space-y-5">
          <div>
            <Skeleton className="h-5 w-24 rounded-full mb-3" />
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-7 w-32" />
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Value Propositions Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-4 border-y border-slate-100">
            <Skeleton className="h-7 w-full rounded-md" />
            <Skeleton className="h-7 w-full rounded-md" />
            <Skeleton className="h-7 w-full rounded-md" />
            <Skeleton className="h-7 w-full rounded-md" />
          </div>

          <div className="pt-2 flex gap-3">
            <Skeleton className="h-11 flex-1 rounded-lg" />
            <Skeleton className="h-11 w-36 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
