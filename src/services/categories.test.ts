import * as categories from './categories';

describe('categories service', () => {
  describe('getCategories', () => {
    it('should call the correct endpoint and return response json', async () => {
      // Arrange
      const mock = [
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
      const fetchMock = jest
        .spyOn(global, 'fetch')
        .mockImplementation(() => Promise.resolve({ json: () => Promise.resolve(JSON.parse(JSON.stringify(mock))) }) as any);

      // Act
      const promise = categories.getCategories();
      const result = await promise;

      // Assert
      const expectedUrl = `${process.env.REACT_APP_API}/categories`;
      expect(fetchMock).toHaveBeenCalledWith(expectedUrl);
      expect(result).toEqual(mock);
    });
  });
});
