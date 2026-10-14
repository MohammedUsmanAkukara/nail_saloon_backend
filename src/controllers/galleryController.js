import GalleryImage from '../models/GalleryImage.js';

export const getGallery = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const query = { active: true };

    if (category && category !== 'All') {
      query.category = category;
    }
    if (featured === 'true') {
      query.featured = true;
    }

    const items = await GalleryImage.find(query).sort({ sortOrder: 1, createdAt: -1 });
    res.json({
      success: true,
      data: items,
    });
  } catch (err) {
    next(err);
  }
};

export const adminGetGallery = async (req, res, next) => {
  try {
    const items = await GalleryImage.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: items,
    });
  } catch (err) {
    next(err);
  }
};

export const adminCreateGalleryImage = async (req, res, next) => {
  try {
    const item = await GalleryImage.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Gallery item added.',
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

export const adminUpdateGalleryImage = async (req, res, next) => {
  try {
    const item = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    res.json({
      success: true,
      message: 'Gallery item updated.',
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

export const adminDeleteGalleryImage = async (req, res, next) => {
  try {
    const item = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }
    res.json({
      success: true,
      message: 'Gallery item deleted.',
    });
  } catch (err) {
    next(err);
  }
};
