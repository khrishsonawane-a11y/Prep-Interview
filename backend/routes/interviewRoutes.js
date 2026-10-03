import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
    createInterview,
    getInterviews,
    getInterviewById,
    updateInterviewProgress,
    finalizeInterview
} from '../controllers/interviewController.js';

const router = express.Router();

// All interview routes are protected by authentication middleware
router.use(requireAuth);

router.post('/', createInterview);
router.get('/', getInterviews);
router.get('/:id', getInterviewById);
router.patch('/:id/progress', updateInterviewProgress);
router.post('/:id/finalize', finalizeInterview);

export default router;
