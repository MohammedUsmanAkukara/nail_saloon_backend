import express from 'express';
import {
  getStaff,
  adminGetStaff,
  adminCreateStaff,
  adminUpdateStaff,
  adminDeleteStaff,
} from '../controllers/staffController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getStaff);
router.get('/admin/all', protect, authorize('superadmin', 'admin', 'manager'), adminGetStaff);
router.post('/admin/create', protect, authorize('superadmin', 'admin', 'manager'), adminCreateStaff);
router.patch('/admin/:id', protect, authorize('superadmin', 'admin', 'manager'), adminUpdateStaff);
router.delete('/admin/:id', protect, authorize('superadmin', 'admin'), adminDeleteStaff);

export default router;
