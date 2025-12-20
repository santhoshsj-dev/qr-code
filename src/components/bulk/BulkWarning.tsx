// src/components/bulk/BulkWarning.tsx
import React from "react";

interface BulkWarningProps {
  rowCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}

// Warning dialog shown before bulk generation.
// Explains CPU/memory usage and recommends desktop.
const BulkWarning: React.FC<BulkWarningProps> = ({
  rowCount,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="rounded-lg border border-amber-500/60 bg-amber-950/40 p-3 text-[11px] text-amber-100">
      <p className="font-medium mb-1">Heads up: bulk generation is intensive.</p>
      <ul className="mb-2 list-disc pl-4 space-y-1">
        <li>All QR codes are generated on your device.</li>
        <li>Large CSV files can slow down or crash the browser.</li>
        <li>Desktop with plenty of RAM is recommended.</li>
        <li>Soft row limit: around 500–1000 rows.</li>
      </ul>
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded border border-amber-500/40 px-2.5 py-1 text-[11px]"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded bg-amber-400 px-2.5 py-1 text-[11px] font-semibold text-slate-950"
        >
          Continue ({rowCount} rows)
        </button>
      </div>
    </div>
  );
};

export default BulkWarning;
