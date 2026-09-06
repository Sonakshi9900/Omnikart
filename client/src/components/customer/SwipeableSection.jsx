import React from 'react';

/**
 * SwipeableSection component creates a smooth native touch swipeable horizontal container
 * using Tailwind's `overflow-x-auto snap-x snap-mandatory scrollbar-none`.
 */
export default function SwipeableSection({ title, subtitle, action, children }) {
  return (
    <section className="space-y-2 sm:space-y-3 py-2">
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between px-1">
          <div>
            {title && (
              <h3 className="text-sm sm:text-base md:text-lg font-extrabold text-white tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      {/* Swipeable Container */}
      <div className="flex items-center gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 pt-1 touch-pan-x">
        {React.Children.map(children, (child) => (
          <div className="snap-start shrink-0">
            {child}
          </div>
        ))}
      </div>
    </section>
  );
}
