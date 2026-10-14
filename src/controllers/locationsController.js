import SalonLocation from '../models/SalonLocation.js';

export const getLocations = async (req, res, next) => {
  try {
    const { city } = req.query;
    const query = { active: true };
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    const locations = await SalonLocation.find(query).sort({ city: 1, name: 1 });
    res.json({
      success: true,
      data: locations,
    });
  } catch (err) {
    next(err);
  }
};

export const getLocationBySlug = async (req, res, next) => {
  try {
    const location = await SalonLocation.findOne({ slug: req.params.slug, active: true });
    if (!location) {
      return res.status(404).json({ success: false, message: 'Salon location not found.' });
    }
    res.json({
      success: true,
      data: location,
    });
  } catch (err) {
    next(err);
  }
};

export const adminGetLocations = async (req, res, next) => {
  try {
    const locations = await SalonLocation.find().sort({ city: 1, name: 1 });
    res.json({
      success: true,
      data: locations,
    });
  } catch (err) {
    next(err);
  }
};

export const adminCreateLocation = async (req, res, next) => {
  try {
    const { name, slug, city, state, address, postalCode, phone, email, openingHours, coordinates, mapEmbedUrl, coverImage, galleryImages, active } = req.body;
    const formattedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const location = await SalonLocation.create({
      name,
      slug: formattedSlug,
      city,
      state: state || '',
      address,
      postalCode: postalCode || '',
      phone,
      email: email || '',
      openingHours: openingHours || [],
      coordinates: coordinates || { lat: 18.922, lng: 72.834 },
      mapEmbedUrl: mapEmbedUrl || '',
      coverImage: coverImage || '',
      galleryImages: galleryImages || [],
      active: active !== undefined ? active : true,
    });

    res.status(201).json({
      success: true,
      message: 'Salon location created successfully.',
      data: location,
    });
  } catch (err) {
    next(err);
  }
};

export const adminUpdateLocation = async (req, res, next) => {
  try {
    const location = await SalonLocation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found.' });
    }

    res.json({
      success: true,
      message: 'Salon location updated successfully.',
      data: location,
    });
  } catch (err) {
    next(err);
  }
};

export const adminDeleteLocation = async (req, res, next) => {
  try {
    const location = await SalonLocation.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found.' });
    }
    res.json({
      success: true,
      message: 'Salon location deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};
