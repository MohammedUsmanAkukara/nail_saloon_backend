import express from 'express';
import {
  createEnquiry,
  adminGetEnquiries,
  adminUpdateEnquiry,
} from '../controllers/enquiriesController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createEnquiry);

router.get('/admin/all', protect, authorize('superadmin', 'admin', 'manager', 'receptionist'), adminGetEnquiries);
router.patch('/admin/:id', protect, authorize('superadmin', 'admin', 'manager', 'receptionist'), adminUpdateEnquiry);

export default router;
