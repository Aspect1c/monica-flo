import React from "react";
import { Flower, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img
            src="../src/photo/IMG_7749.png"
            alt="Bloom AI Logo"
            className="h-16 w-auto 
    transition-all duration-300 hover:scale-105 
    dark:filter dark:brightness-0 dark:invert"
          />
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text--600" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
