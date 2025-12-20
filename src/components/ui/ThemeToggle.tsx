// src/components/ui/ThemeToggle.tsx
import React from "react";
import { useTheme } from "../../lib/theme";
// Use Hugeicons wrapper + core icons
import { HugeiconsIcon } from "@hugeicons/react";
import { SunIcon, MoonIcon } from "@hugeicons/core-free-icons";

const ThemeToggle: React.FC = () => {
  const [theme, toggle] = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      onClick={() => toggle()}
      className="h-8 w-8 rounded-full btn-ghost flex items-center justify-center"
    >
      {isDark ? (
        <HugeiconsIcon icon={SunIcon} size={18} />
      ) : (
        <HugeiconsIcon icon={MoonIcon} size={18} />
      )}
    </button>
  );
};

export default ThemeToggle;