// src/components/bulk/BulkProgress.tsx
import React from "react";

interface BulkProgressProps {
  current: number;
  total: number;
  onCancel: () => void;
}

// Progress bar with current/total count + cancel button.
const BulkProgress: React.FC<BulkProgressProps> = ({
  current,
  total,
  onCancel,
}) => {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="panel p-3 text-[11px]">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-slate-200">Generating QR codes…</span>
        <span className="text-slate-400">
          {current} / {total} ({percent}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded bg-slate-800">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-2 flex justify-end">
        <button
          onClick={onCancel}
          className="rounded border border-slate-600 px-2.5 py-1 text-[11px] text-slate-200 hover:bg-slate-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BulkProgress;
