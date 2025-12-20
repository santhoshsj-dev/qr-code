// src/pages/NotFound.tsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-4 text-center text-xs text-foreground">
      <h1 className="mb-1 text-xl font-semibold">Page not found</h1>
      <p className="mb-3 text-[11px] text-slate-400">
        The page you are looking for does not exist or has moved.
      </p>
      <Link
        to="/"
        className="rounded bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground"
      >
        Back to generator
      </Link>
    </div>
  );
};

export default NotFound;
