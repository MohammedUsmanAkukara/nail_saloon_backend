import express from 'express';
import {
  checkGiftCardBalance,
  createGiftCardEnquiry,
  adminGetGiftCards,
  adminRedeemGiftCard,
} from '../controllers/giftCardsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/check/:code', checkGiftCardBalance);
router.post('/purchase', createGiftCardEnquiry);

router.get('/admin/all', protect, authorize('superadmin', 'admin', 'manager', 'receptionist'), adminGetGiftCards);
router.post('/admin/redeem', protect, authorize('superadmin', 'admin', 'manager', 'receptionist'), adminRedeemGiftCard);

export default router;
