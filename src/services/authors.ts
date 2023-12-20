import type { Author } from '../common/interfaces';

export const getAuthors = async (): Promise<Author[]> => {
  const response = await fetch(`${process.env.REACT_APP_API}/authors`);

  return (await response.json()) as Author[];
};

export const getAuthorById = async (authorId: Author['id']): Promise<Author | undefined> => {
  const response = await fetch(`${process.env.REACT_APP_API}/authors/${authorId}`);

  const author = (await response.json()) as Author;

  // json-server returns an empty object if not found (we want undefined)
  return Object.keys(author).length ? author : undefined;
};

export const updateAuthor = async (author: Author): Promise<boolean> => {
  const response = await fetch(`${process.env.REACT_APP_API}/authors/${author.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(author),
  });

  return response.ok;
};
