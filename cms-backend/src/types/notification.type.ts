export type NotificationStatus = 'sent' | 'failed';

export interface EmailNotification {
  id: string;
  articleId: string;
  recipients: string[];
  subject: string;
  sentAt: Date;
  status: NotificationStatus;
}