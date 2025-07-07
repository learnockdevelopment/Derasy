import mongoose from 'mongoose';

let isConnected = false;

export const dbConnect = async () => {
  if (isConnected) return;
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  isConnected = !!conn.connections[0].readyState;
};
