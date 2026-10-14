import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from '../scripts/seedDatabase.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed in development if database is clean
    if (process.env.NODE_ENV !== 'production') {
      try {
        await seedDatabase({ quiet: true, onlyIfEmpty: true });
      } catch (seedErr) {
        console.warn('[Server] Auto-seed check warning:', seedErr.message);
      }
    }

    const server = app.listen(PORT, () => {
      console.log(`[Nail Salon & Spa API] Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
      console.log(`[Nail Salon & Spa API] Health check available at: http://localhost:${PORT}/api/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
      });
    });
  } catch (err) {
    console.error(`Error starting server: ${err.message}`);
    process.exit(1);
  }
};

startServer();
