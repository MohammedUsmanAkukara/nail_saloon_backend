import Customer from '../models/Customer.js';
import Appointment from '../models/Appointment.js';

export const adminGetCustomers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .sort({ lastVisit: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    res.json({
      success: true,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
      data: customers,
    });
  } catch (err) {
    next(err);
  }
};

export const adminGetCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    const appointments = await Appointment.find({ 'customer.email': customer.email })
      .populate('salonLocation', 'name city')
      .populate('staff', 'name')
      .sort({ appointmentDate: -1 });

    res.json({
      success: true,
      data: customer,
      appointments,
    });
  } catch (err) {
    next(err);
  }
};

export const adminUpdateCustomer = async (req, res, next) => {
  try {
    const { fullName, phone, notes } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { fullName, phone, notes },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    res.json({
      success: true,
      message: 'Customer notes updated.',
      data: customer,
    });
  } catch (err) {
    next(err);
  }
};
