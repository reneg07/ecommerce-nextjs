export default function CheckoutLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-slate-200 pb-6 mb-8">
        <div className="h-7 w-60 bg-slate-200 rounded-md mb-2" />
        <div className="h-4 w-96 bg-slate-100 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Review items & user info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-3">
            <div className="h-4 w-40 bg-slate-200 rounded" />
            <div className="h-4 w-64 bg-slate-100 rounded" />
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-3">
            <div className="h-4 w-48 bg-slate-200 rounded mb-3" />
            <div className="h-14 bg-slate-50 border border-slate-100 rounded-lg" />
            <div className="h-14 bg-slate-50 border border-slate-100 rounded-lg" />
          </div>
        </div>

        {/* Right Column: Order summary card */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-3">
          <div className="h-5 w-36 bg-slate-200 rounded" />
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-10 w-full bg-slate-200 rounded-lg mt-5" />
        </div>
      </div>
    </div>
  );
}
