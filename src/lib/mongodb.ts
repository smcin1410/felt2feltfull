// src/lib/mongodb.ts

import { MongoClient, ServerApiVersion } from 'mongodb';

// --- Vercel Build Debugging ---
console.log('--- Checking Environment Variables ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI is set:', !!process.env.MONGODB_URI);
if (process.env.MONGODB_URI) {
  console.log('MONGODB_URI length:', process.env.MONGODB_URI.length);
  console.log('MONGODB_URI starts with:', process.env.MONGODB_URI.substring(0, 15) + '...');
}
console.log('--- End of Environment Variable Check ---');
// -----------------------------


// Check if the MongoDB URI is set in the environment variables.
// This is a crucial security measure to avoid hardcoding credentials.
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

// We declare a client and a promise to cache the connection.
// This prevents creating a new connection for every request in development.
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// In a development environment, we use a global variable to preserve the
// 'clientPromise' across module reloads caused by Hot Module Replacement (HMR).
// This is a Next.js-specific optimization.
if (process.env.NODE_ENV === 'development') {
  // Check if the promise is already on the global object.
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    // If not, create a new client and store the connection promise.
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production, it's simpler. We create the client and the promise once.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
