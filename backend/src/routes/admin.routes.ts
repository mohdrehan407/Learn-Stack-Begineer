import { Router } from 'express';
import { createSubject, createSection, createVideo, updateOrder, getAdminStats } from '../controllers/admin';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticateToken as any, requireAdmin as any);

router.post('/subjects', createSubject as any);
router.post('/sections', createSection as any);
router.post('/videos', createVideo as any);
router.put('/reorder', updateOrder as any);
router.get('/stats', getAdminStats as any);

export default router;
