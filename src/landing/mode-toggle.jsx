import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import styles from "./mode-toggle.module.css";

export function ModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className={styles.modeToggle}
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className={styles.icon} /> : <Moon className={styles.icon} />}
    </button>
  );
}
