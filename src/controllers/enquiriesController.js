import ContactEnquiry from '../models/ContactEnquiry.js';

export const createEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message, preferredLocation } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and message are required.',
      });
    }

    const enquiry = await ContactEnquiry.create({
      name,
      email: email.toLowerCase().trim(),
      phone: phone || '',
      subject: subject || 'General Consultation',
      message,
      preferredLocation: preferredLocation || null,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Our salon concierge will respond shortly.',
      data: enquiry,
    });
  } catch (err) {
    next(err);
  }
};

export const adminGetEnquiries = async (req, res, next) => {
  try {
    const enquiries = await ContactEnquiry.find()
      .populate('preferredLocation', 'name city')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: enquiries,
    });
  } catch (err) {
    next(err);
  }
};

export const adminUpdateEnquiry = async (req, res, next) => {
  try {
    const { status, internalNotes } = req.body;
    const enquiry = await ContactEnquiry.findByIdAndUpdate(
      req.params.id,
      { status, internalNotes },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    res.json({
      success: true,
      message: 'Enquiry updated.',
      data: enquiry,
    });
  } catch (err) {
    next(err);
  }
};
