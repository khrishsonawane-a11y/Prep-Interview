import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getTechnicalQuestion, getTechnicalQuestions, evaluateTechnicalAnswer } from '../controllers/technicalController.js';

const router = express.Router();

router.use(requireAuth);

router.get('/questions', getTechnicalQuestions);
router.post('/questions', getTechnicalQuestions);
router.post('/question', getTechnicalQuestion);
router.post('/evaluate', evaluateTechnicalAnswer);

export default router;
