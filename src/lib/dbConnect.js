import mongoose from 'mongoose';

// Import all your models here to pre-register them
import './../models/Location';
import './../models/PokerRoom';
import './../models/Tournament';
import './../models/user';
import './../models/Post';
import './../models/Itinerary';
// Add any other models you have...

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // If MONGODB_URI is not available, return null
  if (!MONGODB_URI) {
    console.warn('MONGODB_URI not found. Database operations will be disabled.');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;