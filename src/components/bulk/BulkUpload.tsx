// src/components/bulk/BulkUpload.tsx
import React, { type ChangeEvent } from "react";
import Papa from "papaparse";

interface BulkUploadProps {
  onFileParsed: (fileName: string, rowCount: number, rows?: string[]) => void;
}

// CSV upload dropzone + file input.
const BulkUpload: React.FC<BulkUploadProps> = ({ onFileParsed }) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results: { data: unknown[] }) => {
        const raw = results.data || [];
        const rows = (raw as unknown[]).map((r) => (Array.isArray(r) ? String(r[0] ?? "") : String(r)));
        onFileParsed(file.name, rows.length, rows);
      },


      error: () => {
        onFileParsed(file.name, 0, []);
      },
    });
  };

  return (
    <div className="rounded border border-dashed panel p-4 text-center">
      <p className="mb-2 text-[11px] text-muted">
        Drag & drop a CSV file here, or click to browse.
      </p>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mx-auto block text-[11px]"
      />
    </div>
  );
};

export default BulkUpload;
