import { Request, Response } from 'express';
import { readJSON, writeJSON } from '../utils/file';
import { v4 as uuid } from 'uuid';

export const importArticles = async (
  req: Request,
  res: Response
) => {
  const data = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({
      message: 'Invalid JSON format'
    });
  }

  const articles = await readJSON('articles.json');

  const imported = data.map(item => ({
    id: uuid(),
    ...item,
    status: 'draft',
    featured: false,
    publishedAt: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  await writeJSON(
    'articles.json',
    [...articles, ...imported]
  );

  res.json({
    message: 'Import successful',
    count: imported.length
  });
};