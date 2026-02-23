import { readJSON, writeJSON } from '../utils/file';
import { v4 as uuid } from 'uuid';

export const getAll = async () => readJSON('articles.json');

export const getById = async (id: string) => {
  const articles = await getAll();
  return articles.find(a => a.id === id);
};

export const create = async (data: any) => {
  const articles = await getAll();
  const now = new Date();

  const article = {
    id: uuid(),
    ...data,
    status: 'draft',
    featured: data.featured ?? false,
    publishedAt: null,
    createdAt: now,
    updatedAt: now
  };

  articles.push(article);
  await writeJSON('articles.json', articles);

  return article;
};

export const update = async (id: string, data: any) => {
  const articles = await getAll();
  const index = articles.findIndex(a => a.id === id);
  if (index === -1) return null;

  articles[index] = {
    ...articles[index],
    ...data,
    updatedAt: new Date()
  };

  await writeJSON('articles.json', articles);
  return articles[index];
};

export const remove = async (id: string) => {
  const articles = await getAll();
  await writeJSON(
    'articles.json',
    articles.filter(a => a.id !== id)
  );
};

export const updateStatus = async (
  id: string,
  status: 'draft' | 'published' | 'archived'
) => {
  return update(id, {
    status,
    publishedAt: status === 'published' ? new Date() : null
  });
};