import dotenv from 'dotenv'; 
dotenv.config(); 

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret';

// JWT middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } 
  catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ 
      message: 'Signup failed',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) return res.status(400).json({ message: 'All fields required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ 
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Protected /me endpoint
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to fetch user info',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});
// Save one completed class session
router.post('/class-session', authMiddleware, async (req, res) => {
  try {
    const attentiveness = Number(req.body.attentiveness);

    if (
      !Number.isFinite(attentiveness) ||
      attentiveness < 0 ||
      attentiveness > 100
    ) {
      return res.status(400).json({
        message: 'Attentiveness must be between 0 and 100',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const oldCount = user.classesAttempted || 0;
    const oldAverage = user.averageAttentiveness || 0;
    const newCount = oldCount + 1;

    const newAverage =
      ((oldAverage * oldCount) + attentiveness) / newCount;

    user.classesAttempted = newCount;
    user.averageAttentiveness = Number(newAverage.toFixed(2));
    user.lastClassAttentiveness = Number(attentiveness.toFixed(2));

    await user.save();

    res.json({
      message: 'Class session saved successfully',
      classesAttempted: user.classesAttempted,
      averageAttentiveness: user.averageAttentiveness,
      lastClassAttentiveness: user.lastClassAttentiveness,
    });
  } catch (error) {
    console.error('Save class session error:', error);

    res.status(500).json({
      message: 'Failed to save class session',
    });
  }
});

export default router;