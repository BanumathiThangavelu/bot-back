import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { messages } from '../configs/messages.js';

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: '15m',
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: '7d',
  });
};

// User registration

export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: messages.failed,
        message: messages.user.userExists,
      });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();

    res.status(201).json({
      status: messages.success,
      message: messages.user.userCreate,
      result: { email: user.email, id: user._id },
    });
  } catch (err) {
    res.status(400).json({
      status: messages.failed,
      message: messages.user.userCreateFailed,
      error: err.message,
    });
  }
};
// User login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ status: messages.failed, message: messages.user.userNotFound });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({
        status: messages.failed,
        message: messages.user.invalidCredentials,
      });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      status: messages.success,
      message: messages.user.loginSuccess,
      result: {
        accessToken,
        refreshToken,
        user: { id: user._id, email: user.email },
      },
    });
  } catch (err) {
    res.status(500).json({
      status: messages.failed,
      message: messages.internalServerError,
      error: err.message,
    });
  }
};

// Refresh access token
export const refresh = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({
      status: messages.failed,
      message: messages.refresh.refreshTokenRequired,
    });

  try {
    const user = await User.findOne({ refreshToken });
    if (!user)
      return res.status(403).json({
        status: messages.failed,
        message: messages.refresh.refreshTokenInvalid,
      });

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
      (err, decoded) => {
        if (err || user._id.toString() !== decoded.id) {
          return res.status(403).json({
            status: messages.failed,
            message: messages.refresh.verificationFailed,
          });
        }

        const newAccessToken = generateAccessToken(user);
        res.json({
          status: messages.success,
          message: messages.refresh.refreshTokenSuccess,
          result: { accessToken: newAccessToken },
        });
      },
    );
  } catch (err) {
    res.status(500).json({
      status: messages.failed,
      message: messages.internalServerError,
      error: err.message,
    });
  }
};
// User logout
export const logout = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(204).send();

    user.refreshToken = null;
    await user.save();

    res
      .status(200)
      .json({ status: messages.success, message: messages.user.logoutSuccess });
  } catch (err) {
    res.status(500).json({
      status: messages.failed,
      message: messages.internalServerError,
      error: err.message,
    });
  }
};
