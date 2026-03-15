import { Router } from 'express';
import { saveProgress } from '../controllers/progress';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken as any);
router.post('/save', saveProgress as any);

export default router;
