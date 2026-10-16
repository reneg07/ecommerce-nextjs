import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { ProductSkeletonGrid } from '@/components/products/ProductSkeleton';

export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-3.5 w-16" />
        <span className="text-slate-300">/</span>
        <Skeleton className="h-3.5 w-20" />
      </div>

      {/* Header Skeleton */}
      <div className="mb-8 pb-5 border-b border-slate-200">
        <Skeleton className="h-7 w-64 mb-2" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* Products Grid Skeleton */}
      <ProductSkeletonGrid count={8} />
    </div>
  );
}
