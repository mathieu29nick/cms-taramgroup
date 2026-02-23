import { Request, Response } from 'express';
import * as service from '../services/notification.service';

export const getNotifications = async (
  _: Request,
  res: Response
) => {
  const notifications = await service.getAllNotifications();
  res.json(notifications);
};

export const sendNotification = async (
  req: Request,
  res: Response
) => {
  try {
    const notification =
      await service.createNotification(req.body);

    res.status(201).json(notification);
  } catch (e) {
    res.status(400).json({
      message: "Failed to send",
    });
  }
};