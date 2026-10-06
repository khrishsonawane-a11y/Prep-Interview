import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getProfile, updateProfile } from '../controllers/profileController.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/', updateProfile);
router.patch('/', updateProfile);

export default router;
