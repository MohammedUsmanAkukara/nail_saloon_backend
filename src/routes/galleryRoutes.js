import express from 'express';
import {
  getGallery,
  adminGetGallery,
  adminCreateGalleryImage,
  adminUpdateGalleryImage,
  adminDeleteGalleryImage,
} from '../controllers/galleryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getGallery);
router.get('/admin/all', protect, authorize('superadmin', 'admin'), adminGetGallery);
router.post('/admin/create', protect, authorize('superadmin', 'admin'), adminCreateGalleryImage);
router.patch('/admin/:id', protect, authorize('superadmin', 'admin'), adminUpdateGalleryImage);
router.delete('/admin/:id', protect, authorize('superadmin', 'admin'), adminDeleteGalleryImage);

export default router;
