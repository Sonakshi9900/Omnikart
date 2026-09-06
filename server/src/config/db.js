const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/omnikart';
    const conn = await mongoose.connect(uri, {
      bufferCommands: false,
    });
    isConnected = true;
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Notice]: Running without MongoDB connection (${error.message}).`);
  }
};

module.exports = connectDB;
