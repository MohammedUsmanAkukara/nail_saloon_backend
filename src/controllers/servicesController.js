import Service from '../models/Service.js';
import ServiceCategory from '../models/ServiceCategory.js';

// Public: Get all active services with optional category / location filter
export const getServices = async (req, res, next) => {
  try {
    const { category, locationId, featured, popular, search } = req.query;
    const query = { active: true };

    if (category) {
      const catDoc = await ServiceCategory.findOne({ slug: category });
      if (catDoc) {
        query.category = catDoc._id;
      }
    }

    if (featured === 'true') {
      query.featured = true;
    }
    if (popular === 'true') {
      query.popular = true;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const services = await Service.find(query)
      .populate('category', 'name slug')
      .sort({ sortOrder: 1, name: 1 });

    // If locationId provided, resolve the final price (location override or base price)
    const formatted = services.map((s) => {
      const plain = s.toObject();
      if (locationId) {
        const override = s.locationPricing?.find(
          (lp) => lp.location.toString() === locationId.toString()
        );
        plain.finalPrice = override ? override.price : s.basePrice;
      } else {
        plain.finalPrice = s.basePrice;
      }
      return plain;
    });

    res.json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (err) {
    next(err);
  }
};

// Public: Get single service by slug
export const getServiceBySlug = async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, active: true }).populate(
      'category',
      'name slug'
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    // Related services in same category
    const related = await Service.find({
      category: service.category._id,
      _id: { $ne: service._id },
      active: true,
    }).limit(3);

    res.json({
      success: true,
      data: service,
      related,
    });
  } catch (err) {
    next(err);
  }
};

// Public: Get all categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await ServiceCategory.find({ active: true }).sort({ sortOrder: 1, name: 1 });
    res.json({
      success: true,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Get all services (active and inactive)
export const adminGetServices = async (req, res, next) => {
  try {
    const services = await Service.find()
      .populate('category', 'name slug')
      .populate('locationPricing.location', 'name city')
      .sort({ sortOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      data: services,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Create service
export const adminCreateService = async (req, res, next) => {
  try {
    const { name, slug, category, shortDescription, fullDescription, coverImage, galleryImages, duration, basePrice, locationPricing, featured, popular, active, sortOrder, includedHighlights } = req.body;

    const formattedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const service = await Service.create({
      name,
      slug: formattedSlug,
      category,
      shortDescription,
      fullDescription,
      coverImage,
      galleryImages: galleryImages || [],
      duration,
      basePrice,
      locationPricing: locationPricing || [],
      featured: !!featured,
      popular: !!popular,
      active: active !== undefined ? active : true,
      sortOrder: sortOrder || 0,
      includedHighlights: includedHighlights || [],
    });

    const populated = await Service.findById(service._id).populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      data: populated,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Update service
export const adminUpdateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    res.json({
      success: true,
      message: 'Service updated successfully.',
      data: service,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete service
export const adminDeleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }
    res.json({
      success: true,
      message: 'Service deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};
