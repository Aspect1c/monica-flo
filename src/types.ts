export interface GeneratedImage {
  id?: string;
  url: string;
  modelName: string;
  liked?: boolean;
  likeCount?: number;
}

export interface ImageGenerationError {
  modelName: string;
  message: string;
}

export interface FlowerColorPair {
  flower: string;
  color: string;
}

export interface BouquetSelections {
  shape: string;
  otherShape: string;
  style: string;
  otherStyle: string;
  accentFlowers: string[];
  wrapping: string;
  wrappingColor: string;
  size: string;
  otherSize: string;
  customPrompt: string;
  background: string;
  backgroundColor: string;
  floristChoice: boolean;
}