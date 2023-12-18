import { getCategories } from './categories';
import { getAuthors, createOrUpdateAuthor, getAuthorById } from './authors';
import type { Author, Category, ProcessedVideo, SubmitVideo, Video, VideoFormats } from '../common/interfaces';
import { formatDate } from './utils';

export const getVideos = async (): Promise<ProcessedVideo[]> => {
  const [categories, authors] = await Promise.all([getCategories(), getAuthors()]);

  return mapProcessedVideos(authors, categories);
};

export const createOrUpdateVideo = async (submitVideo: SubmitVideo) => {
  // Get author (and validate if it exists)
  const author = await getAuthorById(submitVideo.authorId);
  if (!author) {
    throw new Error('Author not found');
  }

  // Check if video already exists
  let video = (submitVideo.id && author.videos.find((video) => video.id === submitVideo.id)) || undefined;

  const isCreate = !video;
  if (!video) {
    // New video initial data
    video = {
      id: Date.now(), // :) number id's are a bad idea anyway
      releaseDate: formatDate(),
      formats: {
        one: { res: '1080p', size: 1000 },
      },
      name: submitVideo.name,
      catIds: submitVideo.catIds,
    };
  } else {
    // Update existing video
    video.name = submitVideo.name;
    video.catIds = submitVideo.catIds;
  }

  // If creating, push to author's videos array
  if (isCreate) {
    author.videos.push(video);
  }

  // Update author on database
  return await createOrUpdateAuthor(author);
};

export const deleteVideo = async (videoId: Video['id'], authorId: Author['id']) => {
  // Get author of video
  const author = await getAuthorById(authorId);

  // Return false if author not found
  if (!author) {
    return false;
  }

  // Return false if video not found
  if (!author.videos.find((video) => video.id === videoId)) {
    return false;
  }

  // Remove video from author
  author.videos = author.videos.filter((video) => video.id !== videoId);

  // Update author on database
  return await createOrUpdateAuthor(author);
};

const mapProcessedVideos = (authors: Author[], categories: Category[]): ProcessedVideo[] => {
  return authors.flatMap((author) => author.videos.map<ProcessedVideo>((video) => mapProcessedVideo(video, author, categories)));
};

const mapProcessedVideo = (video: Video, author: Author, categories: Category[]): ProcessedVideo => {
  return {
    id: video.id,
    authorId: author.id,
    author: author.name,
    name: video.name,
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
