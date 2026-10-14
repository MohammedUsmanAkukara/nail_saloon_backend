import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';
import Customer from '../models/Customer.js';
import SalonLocation from '../models/SalonLocation.js';

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [
      totalAppointments,
      todayAppointments,
      pendingCount,
      confirmedCount,
      completedCount,
      cancelledCount,
      noShowCount,
      totalCustomers,
      totalLocations,
      recentAppointments,
    ] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ appointmentDate: today }),
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({ status: 'confirmed' }),
      Appointment.countDocuments({ status: 'completed' }),
      Appointment.countDocuments({ status: 'cancelled' }),
      Appointment.countDocuments({ status: 'no-show' }),
      Customer.countDocuments(),
      SalonLocation.countDocuments({ active: true }),
      Appointment.find()
        .populate('salonLocation', 'name city')
        .populate('staff', 'name')
        .sort({ createdAt: -1 })
        .limit(6),
    ]);

    // Calculate revenue from completed appointments
    const revenueAggregation = await Appointment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;

    // Most booked services
    const topServices = await Appointment.aggregate([
      { $unwind: '$services' },
      { $group: { _id: '$services.name', count: { $sum: 1 }, totalRevenue: { $sum: '$services.price' } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Location distribution
    const locationDistribution = await Appointment.aggregate([
      {
        $group: {
          _id: '$salonLocation',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'salonlocations',
          localField: '_id',
          foreignField: '_id',
          as: 'location',
        },
      },
      { $unwind: { path: '$location', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: '$location.name',
          city: '$location.city',
          count: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalAppointments,
          todayAppointments,
          pendingCount,
          confirmedCount,
          completedCount,
          cancelledCount,
          noShowCount,
          totalRevenue,
          totalCustomers,
          totalLocations,
        },
        topServices,
        locationDistribution,
        recentAppointments,
      },
    });
  } catch (err) {
    next(err);
  }
};
