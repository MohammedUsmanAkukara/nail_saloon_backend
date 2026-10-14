import User from '../models/User.js';

export const adminGetUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('assignedLocations', 'name city')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

export const adminCreateUser = async (req, res, next) => {
  try {
    const { name, email, password, role, assignedLocations } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: 'A user with this email already exists.' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'admin',
      assignedLocations: assignedLocations || [],
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const adminUpdateUser = async (req, res, next) => {
  try {
    const { name, role, assignedLocations, active, password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (assignedLocations) user.assignedLocations = assignedLocations;
    if (active !== undefined) user.active = active;
    if (password) user.password = password;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully.',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const adminDeleteUser = async (req, res, next) => {
  try {
    // Prevent deleting oneself
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, message: 'User deleted.' });
  } catch (err) {
    next(err);
  }
};
