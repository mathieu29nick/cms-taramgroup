import { readJSON, writeJSON } from '../utils/file';
import { v4 as uuid } from 'uuid';

export const getAllCategories = async () =>
  readJSON('categories.json');

export const createCategory = async (data: any) => {
  const categories = await getAllCategories();

  const newCategory = {
    id: uuid(),
    ...data
  };

  categories.push(newCategory);
  await writeJSON('categories.json', categories);

  return newCategory;
};

export const updateCategory = async (id: string, data: any) => {
  const categories = await getAllCategories();
  const index = categories.findIndex(c => c.id === id);

  if (index === -1) return null;

  categories[index] = { ...categories[index], ...data };

  await writeJSON('categories.json', categories);
  return categories[index];
};

export const deleteCategory = async (id: string) => {
  const categories = await getAllCategories();
  const articles = await readJSON('articles.json');

  const isUsed = articles.some(a =>
    a.categories.includes(id)
  );

  if (isUsed) {
    throw new Error('Category is used by articles');
  }

  const filtered = categories.filter(c => c.id !== id);
  await writeJSON('categories.json', filtered);
};