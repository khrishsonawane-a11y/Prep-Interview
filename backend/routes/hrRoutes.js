import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getHRQuestion, getHRQuestions, evaluateHRAnswer } from '../controllers/hrController.js';

const router = express.Router();

router.use(requireAuth);

router.get('/questions', getHRQuestions);
router.post('/questions', getHRQuestions);
router.post('/question', getHRQuestion);
router.post('/evaluate', evaluateHRAnswer);

export default router;
