import Staff from '../models/Staff.js';

export const getStaff = async (req, res, next) => {
  try {
    const { locationId, featured } = req.query;
    const query = { active: true };

    if (locationId) {
      query.assignedLocations = locationId;
    }
    if (featured === 'true') {
      query.featured = true;
    }

    const staff = await Staff.find(query)
      .populate('assignedLocations', 'name city')
      .populate('specialties', 'name')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: staff,
    });
  } catch (err) {
    next(err);
  }
};

export const adminGetStaff = async (req, res, next) => {
  try {
    const staff = await Staff.find()
      .populate('assignedLocations', 'name city')
      .populate('specialties', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: staff,
    });
  } catch (err) {
    next(err);
  }
};

export const adminCreateStaff = async (req, res, next) => {
  try {
    const staff = await Staff.create(req.body);
    const populated = await Staff.findById(staff._id)
      .populate('assignedLocations', 'name city')
      .populate('specialties', 'name');

    res.status(201).json({
      success: true,
      message: 'Staff profile created successfully.',
      data: populated,
    });
  } catch (err) {
    next(err);
  }
};

export const adminUpdateStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('assignedLocations', 'name city')
      .populate('specialties', 'name');

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff profile not found.' });
    }

    res.json({
      success: true,
      message: 'Staff profile updated successfully.',
      data: staff,
    });
  } catch (err) {
    next(err);
  }
};

export const adminDeleteStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff profile not found.' });
    }
    res.json({
      success: true,
      message: 'Staff profile deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};
