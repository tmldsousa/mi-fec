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

export interface VideoWithAuthor {
  video: Video;
  author: Author;
}

export interface VideoFormats {
  [key: string]: {
    res: string;
    size: number;
  };
}
export interface SubmitVideo extends Pick<Video, 'name' | 'catIds'> {
  id?: number;
  authorId: number;
}

export interface Author {
  id: number;
  name: string;
  videos: Video[];
}

export interface ProcessedVideo {
  id: number;
  authorId: number;
  author: string;
  name: string;
  highestQualityFormat: string;
  releaseDate: string;
  categories: string[];
}
