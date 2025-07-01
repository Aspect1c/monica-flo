import { GeneratedImage } from '../types';

const API_KEY = import.meta.env.VITE_CLIPDROP_API_KEY;
const API_URL = 'https://clipdrop-api.co/text-to-image/v1';

export const generateClipDropImage = async (
  prompt: string,
  style: string
): Promise<GeneratedImage> => {
  try {
    if (!API_KEY) {
      throw new Error('API key is missing. Please add your Clipdrop API key to the .env file.');
    }
    
    const formData = new FormData();
  
    const fullPrompt = style && style !== 'realistic' 
      ? `${prompt} in ${style} style`
      : prompt;
    formData.append('prompt', fullPrompt);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ClipDrop API Error: ${response.status} - ${errorText}`);
    }
    
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    return {
      id: `clipdrop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: imageUrl,
      prompt: fullPrompt,
      style,
      timestamp: Date.now(),
      modelName: 'ClipDrop'
    };
  } catch (error) {
    console.error('Error generating ClipDrop image:', error);
    throw error;
  }
};

export const revokeImageUrl = (url: string): void => {
  URL.revokeObjectURL(url);
};