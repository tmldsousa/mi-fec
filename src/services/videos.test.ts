import * as categories from './categories';
import * as authors from './authors';
import * as videos from './videos';
import type { ProcessedVideo, Author, Category, SubmitVideo } from '../common/interfaces';
import { deleteVideo } from './videos';

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
          authorId: 1,
          releaseDate: '2001-01-01',
          highestQualityFormat: 'high 1080p',
          categories: ['Category 1'],
        },
        {
          id: 2,
          name: 'Video 2',
          author: 'Author 1',
          authorId: 1,
          releaseDate: '2001-01-02',
          highestQualityFormat: 'medium 720p',
          categories: ['Category 2'],
        },
        {
          id: 3,
          name: 'Video 3',
          author: 'Author 2',
          authorId: 2,
          releaseDate: '2001-01-03',
          highestQualityFormat: 'low 480p',
          categories: ['Category 1'],
        },
      ];
      expect(getCategoriesSpy).toBeCalledTimes(1);
      expect(getAuthorsSpy).toBeCalledTimes(1);
      expect(result).toEqual<ProcessedVideo[]>(expected);
    });

    it('should map categories in the order they are stored', async () => {
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

  describe('createVideo', () => {
    it("should add a video to the end of the author's video list", async () => {
      // Arrange
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
      ];
      const updateAuthorSpy = jest.spyOn(authors, 'updateAuthor').mockImplementation(async () => true);
      const getAuthorByIdSpy = jest
        .spyOn(authors, 'getAuthorById')
        .mockImplementation(async () => JSON.parse(JSON.stringify(mockAuthors[0])));

      // Act
      const test: SubmitVideo = {
        name: 'Test 1',
        authorId: 1,
        catIds: [1, 2],
      };
      const result = await videos.createVideo(test);

      // Assert
      const expectedResult = true;
      const expectedGetAuthorById = test.authorId;
      const expectedupdateAuthor: Author = {
        id: mockAuthors[0].id,
        name: mockAuthors[0].name,
        videos: [
          ...mockAuthors[0].videos,
          {
            id: expect.any(Number),
            catIds: test.catIds,
            name: test.name,
            formats: {
              one: {
                res: '1080p',
                size: 1000,
              },
            },
            releaseDate: expect.stringMatching(/\d{2}-\d{2}-\d{4}/),
          },
        ],
      };
      expect(getAuthorByIdSpy).toBeCalledTimes(1);
      expect(getAuthorByIdSpy).toBeCalledWith(expectedGetAuthorById);
      expect(updateAuthorSpy).toBeCalledTimes(1);
      expect(updateAuthorSpy).toBeCalledWith(expectedupdateAuthor);
      expect(result).toBe(expectedResult);
    });

    it("should throw if author doesn't exist", async () => {
      // Arrange
      const updateAuthorSpy = jest.spyOn(authors, 'updateAuthor').mockImplementation(async () => true);
      const getAuthorByIdSpy = jest.spyOn(authors, 'getAuthorById').mockImplementation(async () => undefined);

      // Act
      const test: SubmitVideo = {
        id: 1,
        name: 'Test 1',
        authorId: 1,
        catIds: [1, 2],
      };
      const promise = videos.createVideo(test);

      // Assert
      const expectedGetAuthorById = test.authorId;
      expect(getAuthorByIdSpy).toBeCalledTimes(1);
      expect(getAuthorByIdSpy).toBeCalledWith(expectedGetAuthorById);
      expect(updateAuthorSpy).not.toBeCalled();
      await expect(async () => await promise).rejects.toThrowError();
    });
  });

  describe('updateVideo', () => {
    it("should update a video if it's the same author", async () => {
      // Arrange
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
                low: { res: '480p', size: 400 },
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
      ];
      const getAuthorByIdSpy = jest
        .spyOn(authors, 'getAuthorById')
        .mockImplementation(async () => JSON.parse(JSON.stringify(mockAuthors[0])));
      const getAuthorsSpy = jest.spyOn(authors, 'getAuthors').mockImplementation(async () => JSON.parse(JSON.stringify(mockAuthors)));
      const updateAuthorSpy = jest.spyOn(authors, 'updateAuthor').mockImplementation(async () => true);

      // Act
      const test: SubmitVideo = {
        id: 1,
        name: 'Test 1',
        authorId: 1,
        catIds: [1, 2],
      };
      const result = await videos.updateVideo(test);

      // Assert
      const expectedResult = true;
      const expectedGetAuthorById = test.authorId;
      const expectedupdateAuthor: Author = {
        id: mockAuthors[0].id,
        name: mockAuthors[0].name,
        videos: [
          {
            id: test.id as number,
            catIds: test.catIds,
            name: test.name,
            formats: mockAuthors[0].videos[0].formats,
            releaseDate: mockAuthors[0].videos[0].releaseDate,
          },
          ...mockAuthors[0].videos.slice(1),
        ],
      };
      expect(getAuthorByIdSpy).toBeCalledTimes(1);
      expect(getAuthorByIdSpy).toBeCalledWith(expectedGetAuthorById);
      expect(getAuthorsSpy).toBeCalledTimes(1);
      expect(updateAuthorSpy).toBeCalledTimes(1);
      expect(updateAuthorSpy).toBeCalledWith(expectedupdateAuthor);
      expect(result).toBe(expectedResult);
    });

    it('should remove video from previous author and add to the new one', async () => {
      // Arrange
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
                low: { res: '480p', size: 400 },
              },
              releaseDate: '2001-01-01',
            },
          ],
        },
        {
          id: 2,
          name: 'Author 2',
          videos: [
            {
              id: 2,
              catIds: [2],
              name: 'Video 2',
              formats: {
                high: { res: '1080p', size: 1000 },
              },
              releaseDate: '2001-01-01',
            },
          ],
        },
      ];
      const getAuthorByIdSpy = jest
        .spyOn(authors, 'getAuthorById')
        .mockImplementation(async (id) => JSON.parse(JSON.stringify(mockAuthors.find((author) => author.id === id))));
      const getAuthorsSpy = jest.spyOn(authors, 'getAuthors').mockImplementation(async () => JSON.parse(JSON.stringify(mockAuthors)));
      const updateAuthorSpy = jest.spyOn(authors, 'updateAuthor').mockImplementation(async () => true);

      // Act
      const test: SubmitVideo = {
        id: 1,
        name: 'Test 1',
        authorId: 2,
        catIds: [1, 2],
      };
      const result = await videos.updateVideo(test);

      // Assert
      const expectedResult = true;
      const expectedGetAuthorById = test.authorId;
      const expectedupdateAuthor1: Author = {
        id: mockAuthors[1].id,
        name: mockAuthors[1].name,
        videos: mockAuthors[1].videos.concat({
          id: test.id as number,
          catIds: test.catIds,
          name: test.name,
          formats: mockAuthors[0].videos[0].formats,
          releaseDate: mockAuthors[0].videos[0].releaseDate,
        }),
      };
      const expectedupdateAuthor2: Author = {
        id: mockAuthors[0].id,
        name: mockAuthors[0].name,
        videos: mockAuthors[0].videos.slice(1),
      };
      expect(getAuthorByIdSpy).toBeCalledTimes(1);
      expect(getAuthorByIdSpy).toBeCalledWith(expectedGetAuthorById);
      expect(getAuthorsSpy).toBeCalledTimes(1);
      expect(updateAuthorSpy).toBeCalledTimes(2);
      expect(updateAuthorSpy.mock.calls).toEqual([[expectedupdateAuthor1], [expectedupdateAuthor2]]);
      expect(result).toBe(expectedResult);
    });
  });

  describe('deleteVideo', () => {
    it('should delete a video and return true', async () => {
      // Arrange
      const mock: Author[] = [
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
      ];
      const getAuthorByIdSpy = jest.spyOn(authors, 'getAuthorById').mockImplementation(async () => JSON.parse(JSON.stringify(mock[0])));
      const updateAuthor = jest.spyOn(authors, 'updateAuthor').mockImplementation(async () => true);

      // Act
      const testVideoId = mock[0].videos[0].id;
      const testAuthorId = mock[0].id;
      const result = await deleteVideo(testVideoId, testAuthorId);

      // Assert
      const expectedResult = true;
      const expectedGetAuthorById = testAuthorId;
      const expectedupdateAuthor = { ...mock[0], videos: mock[0].videos.slice(1) };
      expect(getAuthorByIdSpy).toBeCalledTimes(1);
      expect(getAuthorByIdSpy).toBeCalledWith(expectedGetAuthorById);
      expect(updateAuthor).toBeCalledTimes(1);
      expect(updateAuthor).toBeCalledWith(expectedupdateAuthor);
      expect(result).toBe(expectedResult);
    });

    it("should return false if author doesn't exist", async () => {
      // Arrange
      const getAuthorByIdSpy = jest.spyOn(authors, 'getAuthorById').mockImplementation(async () => undefined);
      const updateAuthor = jest.spyOn(authors, 'updateAuthor').mockImplementation(async () => {
        throw new Error();
      });

      // Act
      const testVideoId = 1;
      const testAuthorId = 1;
      const result = await deleteVideo(testVideoId, testAuthorId);

      // Assert
      const expectedResult = false;
      const expectedGetAuthorById = testAuthorId;
      expect(getAuthorByIdSpy).toBeCalledTimes(1);
      expect(getAuthorByIdSpy).toBeCalledWith(expectedGetAuthorById);
      expect(updateAuthor).not.toBeCalled();
      expect(result).toBe(expectedResult);
    });

    it("should return false if video doesn't exist in author", async () => {
      // Arrange
      const mock: Author[] = [
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
          ],
        },
      ];
      const getAuthorByIdSpy = jest.spyOn(authors, 'getAuthorById').mockImplementation(async () => JSON.parse(JSON.stringify(mock[0])));
      const updateAuthor = jest.spyOn(authors, 'updateAuthor').mockImplementation(async () => {
        throw new Error();
      });

      // Act
      const testVideoId = 2;
      const testAuthorId = mock[0].id;
      const result = await deleteVideo(testVideoId, testAuthorId);

      // Assert
      const expectedResult = false;
      const expectedGetAuthorById = testAuthorId;
      expect(getAuthorByIdSpy).toBeCalledTimes(1);
      expect(getAuthorByIdSpy).toBeCalledWith(expectedGetAuthorById);
      expect(updateAuthor).not.toBeCalled();
      expect(result).toBe(expectedResult);
    });
  });
});
