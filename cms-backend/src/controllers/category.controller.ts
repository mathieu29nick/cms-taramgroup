import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as service from '../services/category.service';

interface IdParams {
  id: string;
}

export const getCategories = async (
  _: AuthRequest,
  res: Response
) => {
  const categories = await service.getAllCategories();
  res.json(categories);
};

export const createCategory = async (
  req: AuthRequest<{}, any, {
    name: string;
    slug: string;
    description: string;
    color: string;
  }>,
  res: Response
) => {
  const category = await service.createCategory(req.body);
  res.status(201).json(category);
};

export const updateCategory = async (
  req: AuthRequest<IdParams>,
  res: Response
) => {
  const { id } = req.params;

  const updated = await service.updateCategory(
    id,
    req.body
  );

  if (!updated)
    return res.status(404).json({ message: 'Not found' });

  res.json(updated);
};

export const deleteCategory = async (
  req: AuthRequest<IdParams>,
  res: Response
) => {
  try {
    await service.deleteCategory(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};