import * as categories from './categories';
import * as authors from './authors';
import * as videos from './videos';
import type { ProcessedVideo, Author, Category } from '../common/interfaces';

describe('videos service', () => {
  describe('getVideos', () => {
    it('should return all videos from all authors', async () => {
      // Arrange
      const mockCategories: Category[] = [
        {
          id: 1,
          name: 'Category 1',
        },
        {
          id: 2,
          name: 'Category 2',
        },
        {
          id: 3,
          name: 'Category 3',
        },
      ];
      const mockAuthors: Author[] = [
        {
          id: 1,
          name: 'Author 1',
          videos: [
            {
              id: 1,
              catIds: [1],
              name: 'Video 1',
              formats: {
                high: { res: '1080p', size: 1000 },
              },
              releaseDate: '2001-01-01',
            },
            {
              id: 2,
              catIds: [2],
              name: 'Video 2',
              formats: {
                medium: { res: '720p', size: 700 },
              },
              releaseDate: '2001-01-02',
            },
          ],
        },
        {
          id: 2,
          name: 'Author 2',
          videos: [
            {
              id: 3,
              catIds: [1],
              name: 'Video 3',
              formats: {
                low: { res: '480p', size: 730 },
              },
              releaseDate: '2001-01-03',
            },
          ],
        },
      ];
      const getCategoriesSpy = jest.spyOn(categories, 'getCategories').mockImplementation(async () => mockCategories);
      const getAuthorsSpy = jest.spyOn(authors, 'getAuthors').mockImplementation(async () => mockAuthors);

      // Act
      const result = await videos.getVideos();

      // Assert
      const expected = [
        {
          id: 1,
          name: 'Video 1',
          author: 'Author 1',
          releaseDate: '2001-01-01',
          highestQualityFormat: 'high 1080p',
          categories: ['Category 1'],
        },
        {
          id: 2,
          name: 'Video 2',
          author: 'Author 1',
          releaseDate: '2001-01-02',
          highestQualityFormat: 'medium 720p',
          categories: ['Category 2'],
        },
        {
          id: 3,
          name: 'Video 3',
          author: 'Author 2',
          releaseDate: '2001-01-03',
          highestQualityFormat: 'low 480p',
          categories: ['Category 1'],
        },
      ];
      expect(getCategoriesSpy).toBeCalledTimes(1);
      expect(getAuthorsSpy).toBeCalledTimes(1);
      expect(result).toEqual<ProcessedVideo[]>(expected);
    });

    it('should map categories in order they are stored', async () => {
      // Arrange
      const mockCategories: Category[] = [
        {
          id: 1,
          name: 'Category 1',
        },
        {
          id: 2,
          name: 'Category 2',
        },
      ];
      const mockAuthors: Author[] = [
        {
          id: 1,
          name: 'Author 1',
          videos: [
            {
              id: 1,
              catIds: [2, 1],
              name: 'Video 1',
              formats: {
                high: { res: '1080p', size: 1000 },
              },
              releaseDate: '2001-01-01',
            },
          ],
        },
      ];
      const getCategoriesSpy = jest.spyOn(categories, 'getCategories').mockImplementation(async () => mockCategories);
      const getAuthorsSpy = jest.spyOn(authors, 'getAuthors').mockImplementation(async () => mockAuthors);

      // Act
      const result = await videos.getVideos();

      // Assert
      const expected = ['Category 2', 'Category 1'];
      expect(getCategoriesSpy).toBeCalledTimes(1);
      expect(getAuthorsSpy).toBeCalledTimes(1);
      expect(result[0].categories).toStrictEqual(expected);
    });

    it('should ignore missing categories', async () => {
      // Arrange
      const mockCategories: Category[] = [
        {
          id: 2,
          name: 'Category 2',
        },
      ];
      const mockAuthors: Author[] = [
        {
          id: 1,
          name: 'Author 1',
          videos: [
            {
              id: 1,
              catIds: [1, 2],
              name: 'Video 1',
              formats: {
                high: { res: '1080p', size: 1000 },
              },
              releaseDate: '2001-01-01',
            },
          ],
        },
      ];
      const getCategoriesSpy = jest.spyOn(categories, 'getCategories').mockImplementation(async () => mockCategories);
      const getAuthorsSpy = jest.spyOn(authors, 'getAuthors').mockImplementation(async () => mockAuthors);

      // Act
      const result = await videos.getVideos();

      // Assert
      const expected = ['Category 2'];
      expect(getCategoriesSpy).toBeCalledTimes(1);
      expect(getAuthorsSpy).toBeCalledTimes(1);
      expect(result[0].categories).toStrictEqual(expected);
    });

    it('should map highestVideoQuality to format with maximum size', async () => {
      // Arrange
      const mockCategories: Category[] = [
        {
          id: 1,
          name: 'Category 1',
        },
      ];
      const mockAuthors: Author[] = [
        {
          id: 1,
          name: 'Author 1',
          videos: [
            {
              id: 1,
              catIds: [1],
              name: 'Video 1',
              formats: {
                high1: { res: '480p', size: 998 },
                high2: { res: '720p', size: 1000 },
                high3: { res: '1080p', size: 999 },
              },
              releaseDate: '2001-01-01',
            },
          ],
        },
      ];
      const getCategoriesSpy = jest.spyOn(categories, 'getCategories').mockImplementation(async () => mockCategories);
      const getAuthorsSpy = jest.spyOn(authors, 'getAuthors').mockImplementation(async () => mockAuthors);

      // Act
      const result = await videos.getVideos();

      // Assert
      const expected = 'high2 720p';
      expect(getCategoriesSpy).toBeCalledTimes(1);
      expect(getAuthorsSpy).toBeCalledTimes(1);
      expect(result[0].highestQualityFormat).toStrictEqual(expected);
    });

    it('should map highestVideoQuality to format with maximum res if more than one maximum size', async () => {
      // Arrange
      const mockCategories: Category[] = [
        {
          id: 1,
          name: 'Category 1',
        },
      ];
      const mockAuthors: Author[] = [
        {
          id: 1,
          name: 'Author 1',
          videos: [
            {
              id: 1,
              catIds: [1],
              name: 'Video 1',
              formats: {
                high1: { res: '480p', size: 1000 },
                high2: { res: '720p', size: 1000 },
                high3: { res: '1080p', size: 1000 },
              },
              releaseDate: '2001-01-01',
            },
          ],
        },
      ];
      const getCategoriesSpy = jest.spyOn(categories, 'getCategories').mockImplementation(async () => mockCategories);
      const getAuthorsSpy = jest.spyOn(authors, 'getAuthors').mockImplementation(async () => mockAuthors);

      // Act
      const result = await videos.getVideos();

      // Assert
      const expected = 'high3 1080p';
      expect(getCategoriesSpy).toBeCalledTimes(1);
      expect(getAuthorsSpy).toBeCalledTimes(1);
      expect(result[0].highestQualityFormat).toStrictEqual(expected);
    });
  });
});
