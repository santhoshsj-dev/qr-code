// src/components/bulk/BulkModal.tsx
import React from "react";
import BulkGenerator from "./BulkGenerator";

interface BulkModalProps {
  onClose: () => void;
}

// Simple full-screen overlay modal for bulk generation.
// Reuses the same BulkGenerator organism as the dedicated /bulk page.
const BulkModal: React.FC<BulkModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60">
      <div className="relative w-full max-w-3xl panel p-4 shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-2 top-2 h-7 w-7 rounded-full border border-slate-700 text-xs text-slate-200 hover:bg-slate-800"
        >
          ✕
        </button>

        <h2 className="text-sm font-semibold mb-1">Bulk generate (CSV)</h2>
        <p className="text-[11px] text-slate-400 mb-3">
          Runs entirely in your browser. For large files, a desktop device is
          recommended.
        </p>

        <BulkGenerator />
      </div>
    </div>
  );
};

export default BulkModal;
