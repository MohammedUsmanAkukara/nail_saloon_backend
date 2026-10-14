import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { generateToken } from '../utils/generateToken.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password')
      .populate('assignedLocations', 'name slug city');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.active) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact an administrator.',
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(res, user._id, user.role);

    // Audit log
    await AuditLog.create({
      action: 'ADMIN_LOGIN',
      performedBy: user._id,
      userName: user.name,
      targetModel: 'User',
      targetId: user._id.toString(),
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        assignedLocations: user.assignedLocations,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('assignedLocations', 'name slug city');
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        assignedLocations: user.assignedLocations,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    next(err);
  }
};
