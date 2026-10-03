import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getAptitudeQuestions, submitAptitudeAnswer } from '../controllers/aptitudeController.js';

const router = express.Router();

router.use(requireAuth);

router.get('/questions', getAptitudeQuestions);
router.post('/questions', getAptitudeQuestions); // Support POST with body criteria
router.post('/answers', submitAptitudeAnswer);

export default router;
