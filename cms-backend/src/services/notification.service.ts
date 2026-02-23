import { readJSON } from '../utils/file';

export const getAllNotifications = async () =>
  readJSON('notifications.json');