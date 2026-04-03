import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const safeCurrent = Number(currentPage || 1);
  const safeTotal = Number(totalPages || 1);

  if (safeTotal <= 1) return null;

  const go = (page) => {
    if (page < 1 || page > safeTotal) return;
    onPageChange?.(page);
  };

  const start = Math.max(1, safeCurrent - 2);
  const end = Math.min(safeTotal, safeCurrent + 2);
  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        type="button"
        className="p-2 glass-card rounded-lg disabled:opacity-50"
        onClick={() => go(safeCurrent - 1)}
        disabled={safeCurrent <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5 text-primary" />
      </button>

      {start > 1 && (
        <button
          type="button"
          onClick={() => go(1)}
          className="px-3 py-1 glass-card rounded-lg text-sm text-muted-foreground hover:text-foreground hover:glow-on-hover"
        >
          1
        </button>
      )}

      {start > 2 && (
        <span className="text-muted-foreground text-sm px-1">...</span>
      )}

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => go(p)}
          className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
            p === safeCurrent
              ? "gradient-primary text-primary-foreground"
              : "glass-card text-muted-foreground hover:text-foreground hover:glow-on-hover"
          }`}
          aria-current={p === safeCurrent ? "page" : undefined}
        >
          {p}
        </button>
      ))}

      {end < safeTotal - 1 && (
        <span className="text-muted-foreground text-sm px-1">...</span>
      )}

      {end < safeTotal && (
        <button
          type="button"
          onClick={() => go(safeTotal)}
          className="px-3 py-1 glass-card rounded-lg text-sm text-muted-foreground hover:text-foreground hover:glow-on-hover"
        >
          {safeTotal}
        </button>
      )}

      <button
        type="button"
        className="p-2 glass-card rounded-lg disabled:opacity-50"
        onClick={() => go(safeCurrent + 1)}
        disabled={safeCurrent >= safeTotal}
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5 text-primary" />
      </button>
    </div>
  );
};

export default Pagination;
