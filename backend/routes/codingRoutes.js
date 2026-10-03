import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getCodingQuestion, runCode, submitCode } from '../controllers/codingController.js';

const router = express.Router();

router.use(requireAuth);

router.post('/question', getCodingQuestion);
router.post('/run', runCode);
router.post('/submit', submitCode);

export default router;
