import React from "react";
import { Moon, Sun } from "lucide-react";

export default function LoginTheme() {
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="
        flex items-center gap-2
        text-sm
        text-muted-foreground
        hover:text-foreground
        transition
      "
    >
      <Sun className="h-4 w-4 dark:hidden" />
      <Moon className="h-4 w-4 hidden dark:block" />
      <span>Theme</span>
    </button>
  );
}
