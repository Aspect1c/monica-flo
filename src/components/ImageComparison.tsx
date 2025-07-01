import React from 'react';
import { GeneratedImage, ImageGenerationError } from '../types';
import { Download, RefreshCw } from 'lucide-react';

interface ImageComparisonProps {
  images: GeneratedImage[];
  errors: ImageGenerationError[];
  isLoading: boolean;
  prompt: string;
  onRegenerate: () => void;
}

const ImageComparison: React.FC<ImageComparisonProps> = ({
  images,
  errors,
  isLoading,
  prompt,
  onRegenerate,
}) => {
  const handleDownloadImage = (image: GeneratedImage) => {
    // Create a temporary anchor element
    const anchor = document.createElement('a');
    anchor.href = image.url;
    anchor.download = `${image.modelName?.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <div className="w-full">
      {/* Prompt display */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Prompt used:</h3>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-800 dark:text-gray-200">{prompt}</p>
        </div>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* ClipDrop */}
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <h3 className="font-bold">ClipDrop</h3>
          </div>
          <div className="aspect-square relative bg-gray-100 dark:bg-gray-900">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
              </div>
            ) : errors.find(e => e.modelName === 'ClipDrop') ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <p className="text-red-500 font-medium mb-2">Error</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {errors.find(e => e.modelName === 'ClipDrop')?.message}
                </p>
              </div>
            ) : images.find(img => img.modelName === 'ClipDrop') ? (
              <div className="relative h-full">
                <img 
                  src={images.find(img => img.modelName === 'ClipDrop')?.url} 
                  alt="ClipDrop generated image" 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => handleDownloadImage(images.find(img => img.modelName === 'ClipDrop')!)}
                  className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
                >
                  <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </button>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400">No image generated</p>
              </div>
            )}
          </div>
        </div>

        {/* Stability Ultra */}
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
          <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white">
            <h3 className="font-bold">Stability Ultra</h3>
          </div>
          <div className="aspect-square relative bg-gray-100 dark:bg-gray-900">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <RefreshCw className="w-12 h-12 text-purple-500 animate-spin" />
              </div>
            ) : errors.find(e => e.modelName === 'Stability Ultra') ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <p className="text-red-500 font-medium mb-2">Error</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {errors.find(e => e.modelName === 'Stability Ultra')?.message}
                </p>
              </div>
            ) : images.find(img => img.modelName === 'Stability Ultra') ? (
              <div className="relative h-full">
                <img 
                  src={images.find(img => img.modelName === 'Stability Ultra')?.url} 
                  alt="Stability Ultra generated image" 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => handleDownloadImage(images.find(img => img.modelName === 'Stability Ultra')!)}
                  className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
                >
                  <Download className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </button>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400">No image generated</p>
              </div>
            )}
          </div>
        </div>

        {/* Stability Core */}
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
          <div className="p-4 bg-gradient-to-r from-green-500 to-green-700 text-white">
            <h3 className="font-bold">Stability Core</h3>
          </div>
          <div className="aspect-square relative bg-gray-100 dark:bg-gray-900">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <RefreshCw className="w-12 h-12 text-green-500 animate-spin" />
              </div>
            ) : errors.find(e => e.modelName === 'Stability Core') ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <p className="text-red-500 font-medium mb-2">Error</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {errors.find(e => e.modelName === 'Stability Core')?.message}
                </p>
              </div>
            ) : images.find(img => img.modelName === 'Stability Core') ? (
              <div className="relative h-full">
                <img 
                  src={images.find(img => img.modelName === 'Stability Core')?.url} 
                  alt="Stability Core generated image" 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => handleDownloadImage(images.find(img => img.modelName === 'Stability Core')!)}
                  className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
                >
                  <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                </button>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400">No image generated</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Regenerate button */}
      <div className="mt-8 flex justify-center">
        <button 
          onClick={onRegenerate}
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-medium shadow-md hover:shadow-lg flex items-center gap-2 transition-all disabled:opacity-70 disabled:hover:from-blue-600 disabled:hover:to-purple-600 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" /> 
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" /> 
              Regenerate Images
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ImageComparison;