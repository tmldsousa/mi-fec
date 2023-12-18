import { getCategories } from './categories';
import { getAuthors, updateAuthor, getAuthorById } from './authors';
import type { Author, Category, ProcessedVideo, SubmitVideo, Video, VideoFormats, VideoWithAuthor } from '../common/interfaces';
import { format } from 'date-fns/format';

export const getVideos = async (): Promise<ProcessedVideo[]> => {
  const [categories, authors] = await Promise.all([getCategories(), getAuthors()]);

  return mapProcessedVideos(authors, categories);
};

export const getVideoByIdWithAuthor = async (videoId: Video['id']): Promise<VideoWithAuthor | undefined> => {
  // Get all authors so we can find video by id (json-server doesn't support this query. Maybe a middleware would work?)
  const authors = await getAuthors();

  // Find video and it's author
  const videoWithAuthor: VideoWithAuthor | undefined = authors
    .flatMap((author) => author.videos.map((video) => ({ video, author })))
    .find(({ video }) => video.id === videoId);

  return videoWithAuthor;
};

export const createVideo = async (submitVideo: SubmitVideo) => {
  // Get author (and validate if it exists)
  const author = await getAuthorById(submitVideo.authorId);
  if (!author) {
    throw new Error('Author not found');
  }

  // New video initial data
  const newVideo = {
    id: Date.now(), // :) number id's are a bad idea anyway
    releaseDate: format(new Date(), 'dd-MM-yyyy'),
    formats: {
      one: { res: '1080p', size: 1000 },
    },
    name: submitVideo.name,
    catIds: submitVideo.catIds,
  };

  // Push to author's videos array
  author.videos.push(newVideo);

  // Update author on database
  return await updateAuthor(author);
};

export const updateVideo = async (submitVideo: SubmitVideo) => {
  // Validate video id
  const videoId = submitVideo.id;
  if (!videoId) {
    throw new Error('Video id is required');
  }

  // Get author (and validate if it exists)
  const newAuthor = await getAuthorById(submitVideo.authorId);
  if (!newAuthor) {
    throw new Error('Author not found');
  }

  // Get currently store video and it's author
  const videoWithAuthor = await getVideoByIdWithAuthor(videoId);
  if (!videoWithAuthor) {
    throw new Error('Video not found');
  }

  // Update video data
  const { author: previousAuthor, video: previousVideo } = videoWithAuthor;
  const newVideo = {
    ...previousVideo,
    name: submitVideo.name,
    catIds: submitVideo.catIds,
  };

  // If video's author changed, we need to move the video from one author to the other
  if (newAuthor.id !== previousAuthor.id) {
    // Remove video from previous author
    previousAuthor.videos = previousAuthor.videos.filter((video) => video.id !== videoId);

    // Add video to new author
    newAuthor.videos = newAuthor.videos.concat(newVideo);

    // Update both authors
    const results = await Promise.all([updateAuthor(newAuthor), updateAuthor(previousAuthor)]);

    // Return true if all results are true
    return results.every((result) => result);
  } else {
    // Update author's video
    const videoIndex = newAuthor.videos.findIndex((video) => video.id === videoId);
    newAuthor.videos[videoIndex] = newVideo;

    // Update author on database
    return await updateAuthor(newAuthor);
  }
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
  return await updateAuthor(author);
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

/**
 * Gets the highest quality format (Highest size, if equal then highest resolution)
 */
const getHighestQualityFormat = (formats: VideoFormats): string => {
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
