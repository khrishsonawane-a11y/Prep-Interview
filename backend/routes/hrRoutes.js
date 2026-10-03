import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getHRQuestion, evaluateHRAnswer } from '../controllers/hrController.js';

const router = express.Router();

router.use(requireAuth);

router.post('/question', getHRQuestion);
router.post('/evaluate', evaluateHRAnswer);

export default router;
