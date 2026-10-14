import Testimonial from '../models/Testimonial.js';

export const getTestimonials = async (req, res, next) => {
  try {
    const { featured } = req.query;
    const query = { approved: true };
    if (featured === 'true') {
      query.featured = true;
    }

    const reviews = await Testimonial.find(query).sort({ rating: -1, createdAt: -1 });
    res.json({
      success: true,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

export const submitTestimonial = async (req, res, next) => {
  try {
    const { customerName, rating, reviewText, locationName, serviceName } = req.body;

    if (!customerName || !rating || !reviewText) {
      return res.status(400).json({
        success: false,
        message: 'Name, rating and review text are required.',
      });
    }

    const review = await Testimonial.create({
      customerName,
      rating: Number(rating),
      reviewText,
      locationName: locationName || 'Bandra West, Mumbai',
      serviceName: serviceName || 'Bespoke Nail Art',
      verified: false,
      approved: false, // Requires admin moderation
      featured: false,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your review! It has been submitted for moderation.',
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

export const adminGetTestimonials = async (req, res, next) => {
  try {
    const reviews = await Testimonial.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

export const adminUpdateTestimonial = async (req, res, next) => {
  try {
    const review = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }
    res.json({
      success: true,
      message: 'Review updated.',
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

export const adminDeleteTestimonial = async (req, res, next) => {
  try {
    const review = await Testimonial.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }
    res.json({
      success: true,
      message: 'Review deleted.',
    });
  } catch (err) {
    next(err);
  }
};
