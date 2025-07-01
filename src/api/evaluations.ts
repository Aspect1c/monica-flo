import supabase from '../lib/supabase';
import { ImageEvaluation } from '../types';

export const submitEvaluation = async (evaluation: ImageEvaluation): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('model_evaluations')
      .insert({
        model_name: evaluation.modelName,
        image_id: evaluation.imageId,
        bouquet_shape: evaluation.bouquetShape,
        style: evaluation.style,
        flower_quality: evaluation.flowerQuality,
        color_balance: evaluation.colorBalance,
        accent_elements: evaluation.accentElements,
        wrapping_style: evaluation.wrappingStyle,
        bouquet_size: evaluation.bouquetSize,
        background: evaluation.background,
      });

    if (error) {
      console.error('Error submitting evaluation:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Exception submitting evaluation:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit evaluation' 
    };
  }
};