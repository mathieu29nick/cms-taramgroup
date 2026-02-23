import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as service from '../services/article.service';
import { articleSchema } from '../models/article.schema';
import { readJSON, writeJSON } from '../utils/file';
import { v4 as uuid } from 'uuid';

type StatusType = 'draft' | 'published' | 'archived';

interface IdParams {
  id: string;
}

interface UpdateStatusBody {
  status: StatusType;
}

export const getArticles = async (
  req: AuthRequest,
  res: Response
) => {
  let articles = await service.getAll();

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
    page = '1',
    limit = '20'
  } = req.query as Record<string, string>;

  if (status)
    articles = articles.filter(a => a.status === status);

  if (network)
    articles = articles.filter(a => a.network === network);

  if (category)
    articles = articles.filter(a =>
      a.categories.includes(category)
    );

  if (featured)
    articles = articles.filter(
      a => a.featured === (featured === 'true')
    );

  if (search)
    articles = articles.filter(
      a =>
        a.title.includes(search) ||
        a.content.includes(search)
    );

  const start = (Number(page) - 1) * Number(limit);
  const data = articles.slice(start, start + Number(limit));

  res.json({ total: articles.length, data });
};

export const getArticle = async (
  req: AuthRequest<IdParams>,
  res: Response
) => {
  const { id } = req.params;

  const article = await service.getById(id);

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

  const data = parsed.data;

  if (req.user?.role === 'editor') {
    data.network = req.user.network;
  }

  const article = await service.create(data);

  res.status(201).json(article);
};

export const updateArticle = async (
  req: AuthRequest<IdParams>,
  res: Response
) => {
  const { id } = req.params;

  const existing = await service.getById(id);

  if (!existing)
    return res.status(404).json({ message: 'Not found' });

  if (
    req.user?.role === 'editor' &&
    existing.network !== req.user.network
  ) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const updated = await service.update(id, req.body);

  res.json(updated);
};

export const deleteArticle = async (
  req: AuthRequest<IdParams>,
  res: Response
) => {
  const { id } = req.params;

  await service.remove(id);

  res.json({ message: 'Deleted' });
};

export const updateStatus = async (
  req: AuthRequest<IdParams, any, UpdateStatusBody>,
  res: Response
) => {
  const { id } = req.params;
  const { status } = req.body;

  const updated = await service.updateStatus(id, status);

  if (!updated)
    return res.status(404).json({ message: 'Not found' });

  res.json(updated);
};

export const notifyArticle = async (
  req: AuthRequest<IdParams>,
  res: Response
) => {
  const { id } = req.params;
  const { recipients, subject } = req.body;

  const notifications = await readJSON('notifications.json');

  const notification = {
    id: uuid(),
    articleId: id,
    recipients,
    subject,
    sentAt: new Date(),
    status: 'sent'
  };

  notifications.push(notification);

  await writeJSON('notifications.json', notifications);

  res.json(notification);
};