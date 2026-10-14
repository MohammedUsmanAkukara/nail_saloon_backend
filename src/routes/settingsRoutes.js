import express from 'express';
import {
  getPublicSettings,
  adminGetSettings,
  adminUpdateSettings,
} from '../controllers/settingsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/public', getPublicSettings);

router.get('/admin', protect, authorize('superadmin', 'admin'), adminGetSettings);
router.patch('/admin', protect, authorize('superadmin', 'admin'), adminUpdateSettings);

export default router;
