import { Router } from 'express';
import * as controller from '../controllers/network.controller';

const router = Router();

router.get('/', controller.getNetworks);

export default router;