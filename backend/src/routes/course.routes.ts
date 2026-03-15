import { Router } from 'express';
import { getSubjects, getSubjectDetails, enrollSubject, getDashboardInfo } from '../controllers/course';
import { authenticateToken, optionalAuthenticateToken } from '../middleware/auth';

const router = Router();

// Publicly accessible routes (but will identify logged-in users if token exists)
router.get('/', optionalAuthenticateToken as any, getSubjects as any);

// Protected routes
router.get('/dashboard', authenticateToken as any, getDashboardInfo as any);

// Publicly accessible detail route
router.get('/:id', optionalAuthenticateToken as any, getSubjectDetails as any);

// Strictly protected enrollment
router.use(authenticateToken as any);
router.post('/:id/enroll', enrollSubject as any);

export default router;
