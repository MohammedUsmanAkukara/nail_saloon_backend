import jwt from 'jsonwebtoken';

export const generateToken = (res, userId, role) => {
  const secret = process.env.JWT_SECRET || 'sobo_fallback_secret_key_2026';
  const token = jwt.sign({ id: userId, role }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  if (res) {
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  return token;
};
