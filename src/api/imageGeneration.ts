import { GeneratedImage, ImageGenerationError } from '../types';
import { generateClipDropImage } from './clipdropApi';
import { generateStabilityUltraImage, generateStabilityCoreImage } from './stabilityApi';

export const generateImages = async (
  prompt: string,
  style: string
): Promise<{
  images: GeneratedImage[];
  errors: ImageGenerationError[];
}> => {
  const modelPromises = [
    {
      promise: generateClipDropImage(prompt, style),
      name: 'ClipDrop'
    },
    {
      promise: generateStabilityUltraImage(prompt, style),
      name: 'Stability Ultra'
    },
    {
      promise: generateStabilityCoreImage(prompt, style),
      name: 'Stability Core'
    }
  ];

  const results = await Promise.allSettled(modelPromises.map(m => m.promise));
  
  const images: GeneratedImage[] = [];
  const errors: ImageGenerationError[] = [];

  results.forEach((result, index) => {
    const modelName = modelPromises[index].name;
    
    if (result.status === 'fulfilled') {
      images.push(result.value);
    } else {
      errors.push({
        modelName,
        message: result.reason?.message || 'Unknown error'
      });
    }
  });

  return { images, errors };
};

export { revokeImageUrl } from './clipdropApi';