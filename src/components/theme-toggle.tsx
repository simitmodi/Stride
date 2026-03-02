"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // If theme is null (during SSR/hydration), render a hidden or skeleton button
  if (theme === null) {
    return (
      <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 opacity-0" aria-label="Toggle theme">
        <span className="sr-only">Toggle theme hidden</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 overflow-hidden transition-all duration-300 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <Sun className="absolute h-5 w-5 transition-all duration-500 ease-in-out dark:-translate-y-10 dark:opacity-0 translate-y-0 opacity-100" />
        <Moon className="absolute h-5 w-5 transition-all duration-500 ease-in-out translate-y-10 opacity-0 dark:translate-y-0 dark:opacity-100" />
      </div>
    </button>
  );
}
