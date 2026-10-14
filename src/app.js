import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

// Route imports
import authRoutes from './routes/authRoutes.js';
import servicesRoutes from './routes/servicesRoutes.js';
import locationsRoutes from './routes/locationsRoutes.js';
import appointmentsRoutes from './routes/appointmentsRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import testimonialsRoutes from './routes/testimonialsRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import giftCardsRoutes from './routes/giftCardsRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import enquiriesRoutes from './routes/enquiriesRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  })
);

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in development
      }
    },
    credentials: true,
  })
);

app.use(cookieParser(process.env.COOKIE_SECRET || 'sobo_cookie_secret_key_88319'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'Nail Salon & Spa API',
    status: 'online',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/api/health',
      services: '/api/services',
      locations: '/api/locations',
      staff: '/api/staff',
      appointments: '/api/appointments',
      auth: '/api/auth',
    },
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Nail Salon & Spa API',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Ensure database connection before servicing API routes (essential for serverless/Vercel)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Rate limit for authentication
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // 100 attempts per 15 min window
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
});
app.use('/api/auth/login', authLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/gift-cards', giftCardsRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
