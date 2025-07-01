import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { likeImage, unlikeImage } from '../api/likes';

interface LikeButtonProps {
  imageId: string;
  modelName: string;
  initialLiked: boolean;
  onLikeChange: (liked: boolean) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  imageId,
  modelName,
  initialLiked,
  onLikeChange,
}) => {
  const [liked, setLiked] = useState(initialLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeToggle = async () => {
    if (isLoading) return;

    const newLikedState = !liked;

    setIsLoading(true);
    setLiked(newLikedState); // optimistic update

    try {
      if (newLikedState) {
        await likeImage(imageId, modelName);
      } else {
        await unlikeImage(imageId, modelName);
      }

      onLikeChange(newLikedState); // only pass the new like status
    } catch (error) {
      console.error('Error toggling like:', error);
      setLiked(!newLikedState); // rollback
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-white/90 dark:bg-gray-800/90 p-3 rounded-full shadow-lg backdrop-blur-sm">
      <button
        onClick={handleLikeToggle}
        disabled={isLoading}
        className="group relative focus:outline-none"
        aria-label={liked ? 'Unlike this image' : 'Like this image'}
        title={liked ? 'Unlike this image' : 'Like this image'}
      >
        <Heart
          fill={liked ? '#ef4444' : 'none'}
          className={`w-8 h-8 transition-all duration-300 ease-in-out ${
            liked
              ? 'text-red-500 transform scale-110'
              : 'text-gray-600 dark:text-gray-300 group-hover:text-red-400'
          }`}
        />
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default LikeButton;
