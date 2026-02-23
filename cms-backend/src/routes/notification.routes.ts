import { Router } from 'express';
import * as controller from '../controllers/notification.controller';

const router = Router();

router.get('/', controller.getNotifications);

export default router;