import React from 'react';
import { OrdersSkeleton } from '@/components/orders/OrdersSkeleton';

export default function OrdersLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="pb-6 mb-8 border-b border-slate-200">
        <div className="h-7 w-60 bg-slate-200 rounded-md mb-2" />
        <div className="h-4 w-80 bg-slate-100 rounded" />
      </div>

      <OrdersSkeleton />
    </div>
  );
}
