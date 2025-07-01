import React from "react";

interface OptionButtonProps {
  name: string;
  image: string;
  isSelected: boolean;
  onClick: () => void;
  setPreviewImage?: (url: string | null) => void;
}

const OptionButton: React.FC<OptionButtonProps> = ({
  name,
  image,
  isSelected,
  onClick,
  setPreviewImage,
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative group overflow-hidden rounded-xl transition-all duration-200 ${
        isSelected
          ? "ring-2 ring-purple-500 dark:ring-purple-400 transform scale-[1.02]"
          : "hover:ring-2 hover:ring-purple-300 dark:hover:ring-purple-600 hover:transform hover:scale-[1.02]"
      }`}
      onMouseEnter={() => setPreviewImage?.(image)}
    >
      <img
        src={image}
        alt={name}
        className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />

      <div
        className={`absolute inset-0 flex items-center justify-center ${
          isSelected
            ? "bg-purple-500/50 dark:bg-purple-400/50"
            : "bg-black/40 group-hover:bg-black/50"
        } transition-all duration-200`}
      >
        <span className="text-white font-medium text-lg">{name}</span>
      </div>
    </button>
  );
};

export default OptionButton;
