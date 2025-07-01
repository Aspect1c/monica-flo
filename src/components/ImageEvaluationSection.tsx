import React, { useState, useEffect } from 'react';
import { getLikesByModels } from '../api/modelLikes';
import { GeneratedImage } from '../types';

interface ImageEvaluationSectionProps {
  generatedImages: GeneratedImage[];
}

const ImageEvaluationSection: React.FC<ImageEvaluationSectionProps> = ({ 
  generatedImages 
}) => {
  const [modelLikeCounts, setModelLikeCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModelLikes = async () => {
      if (generatedImages.length === 0) return;
      
      setLoading(true);
      try {
        // Extract unique model names
        const modelNames = [...new Set(generatedImages.map(img => img.modelName))];
        
        // Get like counts for all models at once
        const likeCounts = await getLikesByModels(modelNames);
        setModelLikeCounts(likeCounts);
      } catch (error) {
        console.error('Error fetching model likes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModelLikes();
  }, [generatedImages]);

  // Get models sorted by like count
  const getModelRanking = () => {
    return Object.entries(modelLikeCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([modelName, count]) => ({ modelName, count }));
  };

  const rankedModels = getModelRanking();

  if (loading) {
    return <div className="text-center py-6">Loading model statistics...</div>;
  }

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
      <h3 className="text-xl font-bold mb-4">Model Popularity</h3>
      
      {rankedModels.length > 0 ? (
        <>
          <div className="space-y-4">
            {rankedModels.map((model, index) => (
              <div key={model.modelName} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-lg font-semibold mr-2">#{index + 1}</span>
                  <span className="text-md">{model.modelName}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-md font-medium">{model.count}</span>
                  <span className="text-sm ml-1 text-gray-500">likes</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-500">No model data available yet.</p>
      )}
    </div>
  );
};

export default ImageEvaluationSection;