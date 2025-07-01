import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import BouquetGenerator from "./components/BouquetGenerator";
import Footer from "./components/Footer";

function App() {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900 transition-colors duration-300">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <BouquetGenerator />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
