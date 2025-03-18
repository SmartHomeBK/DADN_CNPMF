import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDb connected at: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error from: ${error}`);
  }
};
