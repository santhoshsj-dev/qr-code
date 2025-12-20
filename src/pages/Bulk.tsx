// src/pages/Bulk.tsx
import React from "react";
import BulkGenerator from "../components/bulk/BulkGenerator";

const Bulk: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-lg font-semibold tracking-tight mb-1">
        Bulk QR Generator
      </h1>
      <p className="text-xs text-muted mb-4">
        Upload a CSV and generate multiple static QR codes on your device. Large
        files may use significant CPU and memory.
      </p>

      <BulkGenerator />
    </div>
  );
};

export default Bulk;
