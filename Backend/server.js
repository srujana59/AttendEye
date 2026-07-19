import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';

const app = express();

// CORS configuration
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

app.use(authRoutes);

// Environment variables with defaults
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/classcam';
const JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret-change-in-production';

// Set JWT_SECRET for auth routes
process.env.JWT_SECRET = JWT_SECRET;

// Start server and connect to MongoDB if configured
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  // console.log(`Health check available at http://localhost:${PORT}/health`);

  // Try to connect to MongoDB if MONGO_URI is set
  if (MONGO_URI) {
    mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log('MongoDB connected successfully');
      })
      .catch(err => {
        console.warn('MongoDB connection failed, running without database:', err.message);
        console.log('You can still test the API endpoints, but user data won\'t persist');
      });
  } else {
    console.log('MongoDB not configured, running without database');
    console.log('To enable database, set MONGO_URI in your .env file');
  }
});