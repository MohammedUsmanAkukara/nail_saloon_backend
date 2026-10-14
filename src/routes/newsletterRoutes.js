import express from 'express';
import {
  subscribeNewsletter,
  unsubscribeNewsletter,
  adminGetSubscribers,
  adminExportSubscribers,
} from '../controllers/newsletterController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/subscribe', subscribeNewsletter);
router.post('/unsubscribe', unsubscribeNewsletter);

router.get('/admin/all', protect, authorize('superadmin', 'admin'), adminGetSubscribers);
router.get('/admin/export', protect, authorize('superadmin', 'admin'), adminExportSubscribers);

export default router;
