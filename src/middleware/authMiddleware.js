import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_KEY);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalid or expired' });
  }
};
