import { getCategories } from './categories';
import { getAuthors } from './authors';
import type { Author, Category, ProcessedVideo, Video, VideoFormats } from '../common/interfaces';

export const getVideos = async (): Promise<ProcessedVideo[]> => {
  const [categories, authors] = await Promise.all([getCategories(), getAuthors()]);

  return mapProcessedVideos(authors, categories);
};

const mapProcessedVideos = (authors: Author[], categories: Category[]): ProcessedVideo[] => {
  return authors.flatMap((author) => author.videos.map<ProcessedVideo>((video) => mapProcessedVideo(video, author, categories)));
};

const mapProcessedVideo = (video: Video, author: Author, categories: Category[]) => {
  return {
    id: video.id,
    name: video.name,
    author: author.name,
    releaseDate: video.releaseDate,
    highestQualityFormat: getHighestQualityFormat(video.formats),
    categories: getCategoryNames(video.catIds, categories),
  };
};

const getCategoryNames = (categoryIds: number[], categories: Category[]) =>
  categoryIds.map((categoryId) => categories.find((category) => category.id === categoryId)?.name ?? '').filter((category) => !!category);

const getHighestQualityFormat = (formats: VideoFormats): string => {
  // Find the highest quality format (Highest size, if equal then highest resolution)
  const highestQualityFormat = Object.entries(formats)
    .map(([key, format]) => ({ key, ...format }))
    .reduce((previousValue, currentValue) => {
      return !previousValue ||
        currentValue.size > previousValue.size ||
        (currentValue.size === previousValue.size && parseInt(currentValue.res, 10) > parseInt(previousValue.res, 10))
        ? currentValue
        : previousValue;
    });

  // Format highest quality
  return `${highestQualityFormat.key} ${highestQualityFormat.res}`;
};
