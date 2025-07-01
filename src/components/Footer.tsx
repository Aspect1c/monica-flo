import React from "react";
import { Heart } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
