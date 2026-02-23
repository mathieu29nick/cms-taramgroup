import { uuid } from 'zod';
import { readJSON, writeJSON } from '../utils/file';

export const getAllNotifications = async () =>
  readJSON('notifications.json');

export const createNotification = async (data: any) => {
  const notifications = await getAllNotifications();

  const newNotification = {
    id: uuid(),
    articleId: data.articleId,
    subject: data.subject,
    recipients: data.recipients,
    recipientCount: data.recipients.length,
    status: "sent",
    sentAt: new Date(),
  };

  notifications.push(newNotification);
  await writeJSON("notifications.json", notifications);

  return newNotification;
};