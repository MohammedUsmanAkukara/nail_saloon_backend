import crypto from 'crypto';
import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';
import SalonLocation from '../models/SalonLocation.js';
import Staff from '../models/Staff.js';
import Customer from '../models/Customer.js';
import AuditLog from '../models/AuditLog.js';
import { calculateAvailability, timeToMinutes, minutesToTime } from '../services/availabilityService.js';

const generateBookingReference = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const dateStr = new Date().toISOString().slice(2, 7).replace('-', '');
  return `SOBO-${dateStr}-${rand}`;
};

// GET /api/appointments/availability
export const getAvailability = async (req, res, next) => {
  try {
    const { salonLocationId, date, serviceIds, staffId } = req.query;

    if (!salonLocationId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Salon location and appointment date are required.',
      });
    }

    const ids = Array.isArray(serviceIds)
      ? serviceIds
      : serviceIds
      ? serviceIds.split(',').filter(Boolean)
      : [];

    const availability = await calculateAvailability({
      salonLocationId,
      date,
      serviceIds: ids,
      staffId: staffId || null,
    });

    res.json({
      success: true,
      data: availability,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/appointments
export const createAppointment = async (req, res, next) => {
  try {
    const {
      salonLocationId,
      serviceIds,
      staffId,
      appointmentDate,
      startTime,
      customer,
      customerNotes,
    } = req.body;

    if (!salonLocationId || !serviceIds?.length || !appointmentDate || !startTime || !customer?.fullName || !customer?.email || !customer?.phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required appointment and customer information.',
      });
    }

    // 1. Fetch location
    const location = await SalonLocation.findById(salonLocationId);
    if (!location || !location.active) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive salon location.' });
    }

    // 2. Fetch and snapshot services
    const services = await Service.find({ _id: { $in: serviceIds }, active: true });
    if (!services.length) {
      return res.status(400).json({ success: false, message: 'No valid services selected.' });
    }

    let totalPrice = 0;
    let totalDuration = 0;
    const serviceSnapshots = services.map((s) => {
      const override = s.locationPricing?.find(
        (lp) => lp.location.toString() === salonLocationId.toString()
      );
      const price = override ? override.price : s.basePrice;
      totalPrice += price;
      totalDuration += s.duration || 45;

      return {
        service: s._id,
        name: s.name,
        price,
        duration: s.duration || 45,
      };
    });

    // 3. Calculate End Time
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = startMinutes + totalDuration;
    const endTime = minutesToTime(endMinutes);

    // 4. Verify availability dynamically
    const availabilityCheck = await calculateAvailability({
      salonLocationId,
      date: appointmentDate,
      serviceIds,
      staffId: staffId || null,
    });

    if (!availabilityCheck.slots.includes(startTime)) {
      return res.status(409).json({
        success: false,
        message: 'The requested time slot is no longer available. Please select another slot.',
      });
    }

    // 5. Select or verify artist
    let assignedStaffId = staffId || null;
    if (!assignedStaffId) {
      // Auto-assign first available technician
      const staffList = await Staff.find({ assignedLocations: salonLocationId, active: true });
      const bookedAppts = await Appointment.find({
        salonLocation: salonLocationId,
        appointmentDate,
        status: { $in: ['pending', 'confirmed'] },
      });

      for (const st of staffList) {
        const hasCollision = bookedAppts.some((appt) => {
          if (!appt.staff) return false;
          if (appt.staff.toString() !== st._id.toString()) return false;
          const aStart = timeToMinutes(appt.startTime);
          const aEnd = timeToMinutes(appt.endTime);
          return Math.max(startMinutes, aStart) < Math.min(endMinutes, aEnd);
        });

        if (!hasCollision) {
          assignedStaffId = st._id;
          break;
        }
      }
    }

    // 6. Generate non-guessable reference
    const bookingReference = generateBookingReference();

    // 7. Create Appointment
    const appointment = await Appointment.create({
      bookingReference,
      customer: {
        fullName: customer.fullName.trim(),
        email: customer.email.toLowerCase().trim(),
        phone: customer.phone.trim(),
        notes: customer.notes || '',
      },
      salonLocation: salonLocationId,
      services: serviceSnapshots,
      staff: assignedStaffId,
      appointmentDate,
      startTime,
      endTime,
      totalDuration,
      totalPrice,
      status: 'confirmed',
      paymentStatus: 'unpaid',
      customerNotes: customerNotes || '',
    });

    // 8. Update Customer Profile
    await Customer.findOneAndUpdate(
      { email: customer.email.toLowerCase().trim() },
      {
        $set: {
          fullName: customer.fullName.trim(),
          phone: customer.phone.trim(),
          lastVisit: new Date(),
        },
        $inc: { totalBookings: 1, totalSpent: totalPrice },
      },
      { upsert: true, new: true }
    );

    const populated = await Appointment.findById(appointment._id)
      .populate('salonLocation', 'name address city phone')
      .populate('staff', 'name role avatar');

    res.status(201).json({
      success: true,
      message: 'Your appointment has been confirmed!',
      data: populated,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/appointments/:bookingReference
export const getAppointmentByReference = async (req, res, next) => {
  try {
    const { bookingReference } = req.params;
    const appointment = await Appointment.findOne({ bookingReference })
      .populate('salonLocation', 'name address city phone mapEmbedUrl')
      .populate('staff', 'name role avatar');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment booking reference not found.',
      });
    }

    res.json({
      success: true,
      data: appointment,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/appointments/:bookingReference/cancel
export const cancelAppointment = async (req, res, next) => {
  try {
    const { bookingReference } = req.params;
    const { cancellationToken, reason } = req.body;

    const query = { bookingReference };
    if (cancellationToken) {
      query.cancellationToken = cancellationToken;
    }

    const appointment = await Appointment.findOne(query);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or invalid authorization token.',
      });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This appointment has already been cancelled.',
      });
    }

    appointment.status = 'cancelled';
    appointment.cancellationReason = reason || 'Customer requested cancellation';
    await appointment.save();

    res.json({
      success: true,
      message: 'Your appointment has been successfully cancelled.',
      data: appointment,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/appointments
export const adminGetAppointments = async (req, res, next) => {
  try {
    const { status, locationId, date, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (locationId && locationId !== 'all') {
      query.salonLocation = locationId;
    }
    if (date) {
      query.appointmentDate = date;
    }
    if (search) {
      query.$or = [
        { bookingReference: { $regex: search, $options: 'i' } },
        { 'customer.fullName': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Appointment.countDocuments(query);

    const appointments = await Appointment.find(query)
      .populate('salonLocation', 'name city')
      .populate('staff', 'name avatar')
      .sort({ appointmentDate: -1, startTime: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    res.json({
      success: true,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
      data: appointments,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/appointments/:id/status
export const adminUpdateStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus, internalNotes } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    if (status) appointment.status = status;
    if (paymentStatus) appointment.paymentStatus = paymentStatus;
    if (internalNotes !== undefined) appointment.internalNotes = internalNotes;

    await appointment.save();

    await AuditLog.create({
      action: 'UPDATE_APPOINTMENT_STATUS',
      performedBy: req.user?._id,
      userName: req.user?.name,
      targetModel: 'Appointment',
      targetId: appointment._id.toString(),
      details: { newStatus: status, newPaymentStatus: paymentStatus },
    });

    res.json({
      success: true,
      message: `Appointment updated to '${appointment.status}'.`,
      data: appointment,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/appointments/:id/reschedule
export const adminReschedule = async (req, res, next) => {
  try {
    const { appointmentDate, startTime, staffId } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    const serviceIds = appointment.services.map((s) => s.service);
    const availability = await calculateAvailability({
      salonLocationId: appointment.salonLocation,
      date: appointmentDate,
      serviceIds,
      staffId: staffId || appointment.staff,
    });

    if (!availability.slots.includes(startTime)) {
      return res.status(409).json({
        success: false,
        message: 'The requested reschedule slot is unavailable.',
      });
    }

    const startMin = timeToMinutes(startTime);
    const endMin = startMin + appointment.totalDuration;

    appointment.appointmentDate = appointmentDate;
    appointment.startTime = startTime;
    appointment.endTime = minutesToTime(endMin);
    if (staffId) appointment.staff = staffId;
    appointment.status = 'confirmed';

    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment successfully rescheduled.',
      data: appointment,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/appointments/export
export const adminExportCSV = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate('salonLocation', 'name city')
      .populate('staff', 'name')
      .sort({ appointmentDate: -1 });

    let csv = 'Booking Reference,Customer Name,Email,Phone,Salon,City,Date,Time,Duration,Total Price (INR),Status,Payment Status\n';

    appointments.forEach((a) => {
      const row = [
        `"${a.bookingReference}"`,
        `"${a.customer?.fullName || ''}"`,
        `"${a.customer?.email || ''}"`,
        `"${a.customer?.phone || ''}"`,
        `"${a.salonLocation?.name || ''}"`,
        `"${a.salonLocation?.city || ''}"`,
        `"${a.appointmentDate}"`,
        `"${a.startTime} - ${a.endTime}"`,
        `"${a.totalDuration} mins"`,
        `"${a.totalPrice}"`,
        `"${a.status}"`,
        `"${a.paymentStatus}"`,
      ].join(',');
      csv += row + '\n';
    });

    res.header('Content-Type', 'text/csv');
    res.attachment(`sobo_appointments_${new Date().toISOString().slice(0, 10)}.csv`);
    return res.send(csv);
  } catch (err) {
    next(err);
  }
};
