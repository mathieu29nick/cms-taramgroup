import { Router } from 'express';
import * as controller from '../controllers/category.controller';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

router.get('/', controller.getCategories);
router.post('/', requireAdmin, controller.createCategory);
router.put('/:id', requireAdmin, controller.updateCategory);
router.delete('/:id', requireAdmin, controller.deleteCategory);

export default router;