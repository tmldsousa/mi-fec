import * as authors from './authors';

describe('authors service', () => {
  describe('getAuthors', () => {
    it('should call the correct endpoint and return response json', async () => {
      // Arrange
      const mock = [
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
      const fetchMock = jest
        .spyOn(global, 'fetch')
        .mockImplementation(() => Promise.resolve({ json: () => Promise.resolve(JSON.parse(JSON.stringify(mock))) }) as any);

      // Act
      const promise = authors.getAuthors();
      const result = await promise;

      // Assert
      expect(fetchMock).toHaveBeenCalledWith(`${process.env.REACT_APP_API}/authors`);
      expect(result).toEqual(mock);
    });
  });
});
