import { getCategories } from './categories';
import { getAuthors } from './authors';
import type { Author, Category, ProcessedVideo, SubmitVideo, Video, VideoFormats } from '../common/interfaces';
import { formatDate } from './utils';

export const getVideos = async (): Promise<ProcessedVideo[]> => {
  const [categories, authors] = await Promise.all([getCategories(), getAuthors()]);

  return mapProcessedVideos(authors, categories);
};

export const createVideo = async (submitVideo: SubmitVideo) => {
  // TODO: validation?
  // TODO: refactor

  // Get author (and validate if it exists)
  const authors = await getAuthors();
  const author = authors.find((a) => a.id === submitVideo.authorId);
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

  // Update database
  const response = await fetch(`${process.env.REACT_APP_API}/authors/${author.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(author),
  });

  return response.ok;
};

export const deleteVideo = async (videoId: Video['id']) => {
  // TODO: refactor

  // Find author of video
  const authors = await getAuthors();
  const videoWithAuthor = authors
    ?.flatMap((author) => author.videos.map((video) => ({ author, video })))
    .find(({ video }) => video.id === videoId);

  if (!videoWithAuthor) {
    return false;
  }

  // Remove video from author
  const author = videoWithAuthor.author;
  author.videos = author.videos.filter((video) => video.id !== videoId);

  // Update database
  const response = await fetch(`${process.env.REACT_APP_API}/authors/${author.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(author),
  });

  return response.ok;
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
