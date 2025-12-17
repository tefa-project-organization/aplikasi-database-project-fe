import React, { createContext, useContext, useEffect, useState } from "react";

// Buat context
const ThemeContext = createContext();

// Export Provider
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Cek local storage 
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    
    // Jika tidak ada, cek system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return "dark";
    }
    
    return "light"; // default
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}