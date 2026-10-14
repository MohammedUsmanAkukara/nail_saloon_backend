import mongoose from 'mongoose';

let memoryServer = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sobo_nails';

  try {
    // Attempt standard connection with a short timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[Database] Could not connect to local MongoDB (${err.message}).`);
    
    // In development/test mode, fall back to mongodb-memory-server if available
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('[Database] Initializing development in-memory MongoDB fallback...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        const memUri = memoryServer.getUri();
        const memConn = await mongoose.connect(memUri);
        console.log(`[Database] Embedded in-memory MongoDB Connected: ${memUri}`);
        return memConn;
      } catch (memErr) {
        console.error('[Database] Failed to initialize in-memory MongoDB:', memErr.message);
        throw err;
      }
    } else {
      throw err;
    }
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
