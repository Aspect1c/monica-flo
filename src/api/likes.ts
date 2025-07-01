import supabase from '../lib/supabase';
import { LikeRequest } from '../types';

// Get like count for an image
// Отримати загальну кількість лайків по model_name (а не по imageId)
export const getLikeCount = async (modelName: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('image_likes')
      .select('*', { count: 'exact', head: true })
      .eq('model_name', modelName);

    if (error) {
      console.error('Error getting like count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Exception getting like count:', error);
    return 0;
  }
};



// Check if user has liked an image
export const checkIfLiked = async (imageId: string): Promise<boolean> => {
  try {
    // Get user ID from Supabase auth if available
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    const { data, error } = await supabase
      .from('image_likes')
      .select('id')
      .eq('image_id', imageId)
      .eq('user_id', user.id)
      .single();
    
    if (error && error.code !== 'PGSQL_ERROR') {
      console.error('Error checking if liked:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Exception checking if liked:', error);
    return false;
  }
};

// Like an image
export const likeImage = async (imageId: string, modelName: string): Promise<boolean> => {
  try {
    // Get user ID from Supabase auth if available
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'anonymous';
    
    const { error } = await supabase
      .from('image_likes')
      .insert({
        image_id: imageId,
        user_id: userId,
        model_name: modelName
      });
    
    if (error) {
      console.error('Error liking image:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception liking image:', error);
    return false;
  }
};

// Unlike an image
export const unlikeImage = async (imageId: string, modelName: string): Promise<boolean> => {
  try {
    // Get user ID from Supabase auth if available
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'anonymous';
    
    const { error } = await supabase
      .from('image_likes')
      .delete()
      .eq('image_id', imageId)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error unliking image:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception unliking image:', error);
    return false;
  }
};

// Get image likes for initial loading
export const getImageLikes = async (imageIds: string[]): Promise<Record<string, number>> => {
  if (!imageIds.length) return {};
  
  try {
    const { data, error } = await supabase
      .from('image_likes')
      .select('image_id, id')
      .in('image_id', imageIds);
    
    if (error) {
      console.error('Error fetching image likes:', error);
      return {};
    }
    
    // Count likes for each image
    return data.reduce((acc, like) => {
      acc[like.image_id] = (acc[like.image_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  } catch (error) {
    console.error('Exception fetching image likes:', error);
    return {};
  }
};