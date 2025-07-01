export interface GeneratedImage {
  url: string;
  modelName: string;
  imageId?: string;
}

export interface ImageGenerationError {
  modelName: string;
  message: string;
}

export type RatingValue = 'good' | 'partial' | 'bad';

export interface ImageEvaluation {
  modelName: string;
  imageId: string;
  bouquetShape: RatingValue;
  style: RatingValue;
  flowerQuality: RatingValue;
  colorBalance: RatingValue;
  accentElements: RatingValue;
  wrappingStyle: RatingValue;
  bouquetSize: RatingValue;
  background: RatingValue;
  isSubmitted?: boolean;
}

export interface EvaluationCriterion {
  id: string;
  name: string;
  description: string;
}