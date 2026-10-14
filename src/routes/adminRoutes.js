import express from 'express';
import { getDashboardAnalytics } from '../controllers/analyticsController.js';
import {
  adminGetUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
} from '../controllers/usersController.js';
import {
  adminGetCustomers,
  adminGetCustomerById,
  adminUpdateCustomer,
} from '../controllers/customersController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Analytics
router.get('/analytics', protect, authorize('superadmin', 'admin', 'manager'), getDashboardAnalytics);

// Customers
router.get('/customers', protect, authorize('superadmin', 'admin', 'manager', 'receptionist'), adminGetCustomers);
router.get('/customers/:id', protect, authorize('superadmin', 'admin', 'manager', 'receptionist'), adminGetCustomerById);
router.patch('/customers/:id', protect, authorize('superadmin', 'admin', 'manager'), adminUpdateCustomer);

// Admin Users (Superadmin only)
router.get('/users', protect, authorize('superadmin'), adminGetUsers);
router.post('/users', protect, authorize('superadmin'), adminCreateUser);
router.patch('/users/:id', protect, authorize('superadmin'), adminUpdateUser);
router.delete('/users/:id', protect, authorize('superadmin'), adminDeleteUser);

export default router;
