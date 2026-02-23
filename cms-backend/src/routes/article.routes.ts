import { Router } from 'express';
import * as controller from '../controllers/article.controller';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

router.get('/', controller.getArticles);
router.get('/:id', controller.getArticle);
router.post('/', controller.createArticle);
router.put('/:id', controller.updateArticle);
router.delete('/:id', requireAdmin, controller.deleteArticle);
router.patch('/:id/status', controller.updateStatus);
router.post('/:id/notify', controller.notifyArticle);

export default router;