import React from 'react';

export function OrdersSkeleton() {
  return (
    <div className="space-y-3 animate-pulse" id="orders-skeleton">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-5 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="space-y-2">
            <div className="h-5 w-32 bg-slate-200 rounded" />
            <div className="h-4 w-48 bg-slate-100 rounded" />
            <div className="h-3.5 w-24 bg-slate-100 rounded" />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="h-6 w-20 bg-slate-100 rounded-full" />
            <div className="h-9 w-24 bg-slate-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
