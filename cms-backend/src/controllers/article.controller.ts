import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as service from '../services/article.service';
import { articleSchema } from '../models/article.schema';
import { readJSON, writeJSON } from '../utils/file';
import { v4 as uuid } from 'uuid';

export const getArticles = async (
  req: AuthRequest,
  res: Response
) => {
  let articles = await service.getAll();

  // 🔒 segmentation réseau
  if (req.user?.role === 'editor') {
    articles = articles.filter(
      a => a.network === req.user?.network
    );
  }

  const {
    status,
    network,
    category,
    featured,
    search,
    page = 1,
    limit = 20
  } = req.query;

  if (status)
    articles = articles.filter(a => a.status === status);

  if (network)
    articles = articles.filter(a => a.network === network);

  if (category)
    articles = articles.filter(a =>
      a.categories.includes(category as string)
    );

  if (featured)
    articles = articles.filter(
      a => a.featured === (featured === 'true')
    );

  if (search)
    articles = articles.filter(
      a =>
        a.title.includes(search as string) ||
        a.content.includes(search as string)
    );

  const start = (Number(page) - 1) * Number(limit);
  const data = articles.slice(start, start + Number(limit));

  res.json({ total: articles.length, data });
};

export const getArticle = async (
  req: AuthRequest,
  res: Response
) => {
  const article = await service.getById(req.params.id);
  if (!article)
    return res.status(404).json({ message: 'Not found' });

  if (
    req.user?.role === 'editor' &&
    article.network !== req.user.network
  ) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  res.json(article);
};

export const createArticle = async (
  req: AuthRequest,
  res: Response
) => {
  const parsed = articleSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json(parsed.error);

  if (req.user?.role === 'editor') {
    parsed.data.network = req.user.network;
  }

  const article = await service.create(parsed.data);
  res.status(201).json(article);
};

export const updateArticle = async (
  req: AuthRequest,
  res: Response
) => {
  const updated = await service.update(req.params.id, req.body);
  if (!updated)
    return res.status(404).json({ message: 'Not found' });

  if (
    req.user?.role === 'editor' &&
    updated.network !== req.user.network
  ) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  res.json(updated);
};

export const deleteArticle = async (
  req: AuthRequest,
  res: Response
) => {
  await service.remove(req.params.id);
  res.json({ message: 'Deleted' });
};

export const updateStatus = async (
  req: AuthRequest,
  res: Response
) => {
  const updated = await service.updateStatus(
    req.params.id,
    req.body.status
  );
  res.json(updated);
};

export const notifyArticle = async (
  req: AuthRequest,
  res: Response
) => {
  const notifications = await readJSON('notifications.json');

  const notification = {
    id: uuid(),
    articleId: req.params.id,
    recipients: req.body.recipients,
    subject: req.body.subject,
    sentAt: new Date(),
    status: 'sent'
  };

  notifications.push(notification);
  await writeJSON('notifications.json', notifications);

  res.json(notification);
};