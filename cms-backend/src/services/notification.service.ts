import { uuid } from 'zod';
import { readJSON, writeJSON } from '../utils/file';

export const getAllNotifications = async () =>
  readJSON('notifications.json');

import { sendEmail } from "./email.service";
import { getById } from "./article.service";

export const createNotification = async (data: any) => {
  const notifications = await getAllNotifications();

  const article = await getById(data.articleId);

  if (!article) {
    throw new Error("Article not found");
  }

  try {
    await sendEmail({
      subject: data.subject,
      recipients: data.recipients,
      html: `
        <h2>${article.title}</h2>
        <p>${article.content}</p>
      `,
    });

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

  } catch (error) {
    const failedNotification = {
      id: uuid(),
      articleId: data.articleId,
      subject: data.subject,
      recipients: data.recipients,
      recipientCount: data.recipients.length,
      status: "failed",
      sentAt: new Date(),
    };

    notifications.push(failedNotification);
    await writeJSON("notifications.json", notifications);

    return failedNotification;
  }
};