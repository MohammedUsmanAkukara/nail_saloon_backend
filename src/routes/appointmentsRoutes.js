import express from 'express';
import {
  getAvailability,
  createAppointment,
  getAppointmentByReference,
  cancelAppointment,
  adminGetAppointments,
  adminUpdateStatus,
  adminReschedule,
  adminExportCSV,
} from '../controllers/appointmentsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/availability', getAvailability);
router.post('/', createAppointment);
router.get('/reference/:bookingReference', getAppointmentByReference);
router.post('/reference/:bookingReference/cancel', cancelAppointment);

// Admin
router.get('/admin/all', protect, authorize('superadmin', 'admin', 'manager', 'receptionist'), adminGetAppointments);
router.get('/admin/export', protect, authorize('superadmin', 'admin', 'manager'), adminExportCSV);
router.patch('/admin/:id/status', protect, authorize('superadmin', 'admin', 'manager', 'receptionist'), adminUpdateStatus);
router.patch('/admin/:id/reschedule', protect, authorize('superadmin', 'admin', 'manager', 'receptionist'), adminReschedule);

export default router;
