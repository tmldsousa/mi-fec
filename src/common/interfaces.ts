export interface Category {
  id: number;
  name: string;
}

export interface Video {
  id: number;
  catIds: number[];
  name: string;
  formats: VideoFormats;
  releaseDate: string;
}

export interface VideoFormats {
  [key: string]: {
    res: string;
    size: number;
  };
}

export interface Author {
  id: number;
  name: string;
  videos: Video[];
}

export interface ProcessedVideo {
  id: number;
  name: string;
  author: string;
  highestQualityFormat: string;
  releaseDate: string;
  categories: string[];
}
