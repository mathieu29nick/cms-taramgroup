import { Request, Response } from 'express';
import * as service from '../services/notification.service';

export const getNotifications = async (
  _: Request,
  res: Response
) => {
  const notifications = await service.getAllNotifications();
  res.json(notifications);
};