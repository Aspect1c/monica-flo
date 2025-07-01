import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import LikeButton from './LikeButton';
import { checkIfLiked, getLikeCount } from '../api/likes';
import { GeneratedImage } from '../types';

interface ImageCardProps {
  image: GeneratedImage;
  isGenerating: boolean;
  onDownload: (image: GeneratedImage) => void;
  isDownloading: boolean;
}

const ImageCard: React.FC<ImageCardProps> = ({ 
  image, 
  isGenerating, 
  onDownload, 
  isDownloading 
}) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchLikeData = async () => {
      if (!image.id) return;

      try {
        const [isLiked, count] = await Promise.all([
          checkIfLiked(image.id),
          getLikeCount(image.modelName), // <- modelName here
        ]);

        setLiked(isLiked);
        setLikeCount(count);
      } catch (error) {
        console.error('Error fetching like data:', error);
      }
    };

    fetchLikeData();
  }, [image.id, image.modelName]);

  const handleLikeChange = async (newLiked: boolean) => {
    setLiked(newLiked);
    try {
      const updatedCount = await getLikeCount(image.modelName);
      setLikeCount(updatedCount);
    } catch (error) {
      console.error('Failed to refresh like count:', error);
    }
  };

  const getBgGradient = () => {
    switch (image.modelName) {
      case 'ClipDrop':
        return 'bg-gradient-to-r from-blue-500 to-blue-700';
      case 'Stability Ultra':
        return 'bg-gradient-to-r from-purple-500 to-purple-700';
      default:
        return 'bg-gradient-to-r from-green-500 to-green-700';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
      <div className={`p-4 text-white ${getBgGradient()}`}>
        <h3 className="font-bold">{image.modelName}</h3>
      </div>

      <div className="aspect-square relative bg-gray-100 dark:bg-gray-900">
        {image.url && !isGenerating && (
          <div className="relative h-full group">
            <img 
              src={image.url}
              alt={`${image.modelName} generated bouquet`}
              className="w-full h-full object-cover"
            />

            <div className="absolute top-4 right-4 z-10 transform scale-110">
              <LikeButton 
                imageId={image.id || `${image.modelName}-${Date.now()}`}
                modelName={image.modelName}
                initialLiked={liked}
                onLikeChange={handleLikeChange}
              />
            </div>

            <button 
              onClick={() => onDownload(image)}
              disabled={isDownloading}
              className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </button>

            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-white text-base flex items-center gap-2">
              <span className="font-medium">{likeCount}</span>
              <span>likes</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCard;
