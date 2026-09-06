const jwt = require('jsonwebtoken');
const User = require('../models/User');
const VendorProfile = require('../models/VendorProfile');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'omnikart_secret_jwt_key_2026', {
    expiresIn: '7d',
  });
};

const sendTokenResponse = async (user, statusCode, res) => {
  const token = generateToken(user._id, user.role);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  let vendorProfile = null;
  if (user.role === 'vendor') {
    vendorProfile = await VendorProfile.findOne({ user: user._id });
  }

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      vendorProfile,
    },
  });
};

// @desc Register User (Customer or Vendor)
// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, storeName, description } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email address already in use.' });
    }

    const userRole = role === 'vendor' ? 'vendor' : 'customer';

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
    });

    if (userRole === 'vendor') {
      const slug = (storeName || name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      await VendorProfile.create({
        user: user._id,
        storeName: storeName || `${name}'s Store`,
        storeSlug: `${slug}-${Date.now().toString().slice(-4)}`,
        description: description || 'Welcome to our official store on OmniKart!',
        isApproved: false, // Default false until approved by Super Admin
      });
    }

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc Login User
// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated.' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc Logout User / Clear Cookie
// @route POST /api/auth/logout
const logout = async (req, res) => {
  res.cookie('jwt', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: 'User logged out successfully.' });
};

// @desc Get current logged-in user profile
// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let vendorProfile = null;
    if (user.role === 'vendor') {
      vendorProfile = await VendorProfile.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        vendorProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, getMe };
