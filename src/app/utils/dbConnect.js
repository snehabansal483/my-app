import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI; 

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

let cached = global.mongo; 

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Connected to MongoDB successfully');
      return mongoose;
    }).catch(err => {
      console.error('MongoDB connection error:', err);
      throw err; 
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
