import express from 'express';
import {
  getBlogPosts,
  getBlogPostBySlug,
  adminGetBlogPosts,
  adminCreateBlogPost,
  adminUpdateBlogPost,
  adminDeleteBlogPost,
} from '../controllers/blogController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBlogPosts);
router.get('/:slug', getBlogPostBySlug);

router.get('/admin/all', protect, authorize('superadmin', 'admin'), adminGetBlogPosts);
router.post('/admin/create', protect, authorize('superadmin', 'admin'), adminCreateBlogPost);
router.patch('/admin/:id', protect, authorize('superadmin', 'admin'), adminUpdateBlogPost);
router.delete('/admin/:id', protect, authorize('superadmin', 'admin'), adminDeleteBlogPost);

export default router;
