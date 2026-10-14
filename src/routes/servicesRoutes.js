import express from 'express';
import {
  getServices,
  getServiceBySlug,
  getCategories,
  adminGetServices,
  adminCreateService,
  adminUpdateService,
  adminDeleteService,
} from '../controllers/servicesController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getServices);
router.get('/categories', getCategories);
router.get('/:slug', getServiceBySlug);

// Admin
router.get('/admin/all', protect, authorize('superadmin', 'admin', 'manager'), adminGetServices);
router.post('/admin/create', protect, authorize('superadmin', 'admin'), adminCreateService);
router.patch('/admin/:id', protect, authorize('superadmin', 'admin'), adminUpdateService);
router.delete('/admin/:id', protect, authorize('superadmin', 'admin'), adminDeleteService);

export default router;
