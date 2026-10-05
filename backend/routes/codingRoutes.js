import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getCodingQuestion, getCodingQuestions, runCode, submitCode } from '../controllers/codingController.js';

const router = express.Router();

router.use(requireAuth);

router.get('/questions', getCodingQuestions);
router.post('/questions', getCodingQuestions);
router.post('/question', getCodingQuestion);
router.post('/run', runCode);
router.post('/submit', submitCode);

export default router;
