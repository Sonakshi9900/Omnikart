import React from 'react';

export default function ProductSkeleton() {
  return (
    <div className="glass-panel rounded-3xl p-5 border border-slate-800/80 bg-slate-900/40 flex flex-col justify-between space-y-4 animate-pulse">
      <div className="space-y-4">
        {/* Skeleton Image Box */}
        <div className="aspect-[4/3] w-full rounded-2xl bg-slate-800/60 skeleton-shimmer" />

        {/* Skeleton Details */}
        <div className="space-y-2.5">
          {/* Vendor Badge line */}
          <div className="h-3 w-1/3 rounded-md bg-slate-800/60 skeleton-shimmer" />

          {/* 2-line Title placeholder */}
          <div className="space-y-1.5">
            <div className="h-4 w-full rounded-md bg-slate-800/80 skeleton-shimmer" />
            <div className="h-4 w-2/3 rounded-md bg-slate-800/80 skeleton-shimmer" />
          </div>

          {/* Description line */}
          <div className="h-3 w-4/5 rounded-md bg-slate-800/40 skeleton-shimmer" />

          {/* Rating placeholder */}
          <div className="h-3 w-1/4 rounded-md bg-slate-800/60 skeleton-shimmer pt-1" />
        </div>
      </div>

      {/* Skeleton Footer */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-800/80 mt-4">
        <div className="space-y-1.5">
          <div className="h-2.5 w-10 rounded bg-slate-800/40 skeleton-shimmer" />
          <div className="h-5 w-20 rounded-md bg-slate-800/80 skeleton-shimmer" />
        </div>

        {/* Skeleton Button */}
        <div className="h-9 w-20 rounded-xl bg-slate-800/80 skeleton-shimmer" />
      </div>
    </div>
  );
}
