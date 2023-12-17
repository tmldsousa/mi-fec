import type { Category } from '../common/interfaces';

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${process.env.REACT_APP_API}/categories`);

  return (await response.json()) as Category[];
};
