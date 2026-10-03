import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
    handleGenerateQuestion,
    handleEvaluateAnswer,
    handleFinalFeedback
} from '../controllers/aiController.js';

const router = express.Router();

router.use(requireAuth);

router.post('/generate-question', handleGenerateQuestion);
router.post('/evaluate-answer', handleEvaluateAnswer);
router.post('/final-feedback', handleFinalFeedback);

export default router;
