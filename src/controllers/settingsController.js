import SiteSettings from '../models/SiteSettings.js';

export const getPublicSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json({
      success: true,
      data: settings,
    });
  } catch (err) {
    next(err);
  }
};

export const adminGetSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json({
      success: true,
      data: settings,
    });
  } catch (err) {
    next(err);
  }
};

export const adminUpdateSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(req.body);
    } else {
      settings = await SiteSettings.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.json({
      success: true,
      message: 'Website settings updated successfully.',
      data: settings,
    });
  } catch (err) {
    next(err);
  }
};
