import express from 'express';
import {
  getLocations,
  getLocationBySlug,
  adminGetLocations,
  adminCreateLocation,
  adminUpdateLocation,
  adminDeleteLocation,
} from '../controllers/locationsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getLocations);
router.get('/:slug', getLocationBySlug);

router.get('/admin/all', protect, authorize('superadmin', 'admin', 'manager'), adminGetLocations);
router.post('/admin/create', protect, authorize('superadmin', 'admin'), adminCreateLocation);
router.patch('/admin/:id', protect, authorize('superadmin', 'admin', 'manager'), adminUpdateLocation);
router.delete('/admin/:id', protect, authorize('superadmin', 'admin'), adminDeleteLocation);

export default router;
