// src/components/bulk/BulkResult.tsx
import React from "react";

interface BulkResultProps {
  status: "completed" | "canceled";
  rowCount: number;
  onDownloadZip: () => void;
}

// Final state after bulk run: success / canceled + Download ZIP.
const BulkResult: React.FC<BulkResultProps> = ({
  status,
  rowCount,
  onDownloadZip,
}) => {
  const isSuccess = status === "completed";

  return (
    <div className="panel p-3 text-[11px]">
      <p className="mb-2">
        {isSuccess ? (
          <>
            Successfully generated QR codes for{" "}
            <span className="font-semibold text-foreground">{rowCount}</span>{" "}
            rows.
          </>
        ) : (
          <>Generation was canceled. Partial results are not saved yet.</>
        )}
      </p>
      {isSuccess && (
        <button
          onClick={onDownloadZip}
          className="rounded bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground"
        >
          Download ZIP
        </button>
      )}
    </div>
  );
};

export default BulkResult;
