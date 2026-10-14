import express from 'express';
import {
  getTestimonials,
  submitTestimonial,
  adminGetTestimonials,
  adminUpdateTestimonial,
  adminDeleteTestimonial,
} from '../controllers/testimonialsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTestimonials);
router.post('/', submitTestimonial);

router.get('/admin/all', protect, authorize('superadmin', 'admin'), adminGetTestimonials);
router.patch('/admin/:id', protect, authorize('superadmin', 'admin'), adminUpdateTestimonial);
router.delete('/admin/:id', protect, authorize('superadmin', 'admin'), adminDeleteTestimonial);

export default router;
