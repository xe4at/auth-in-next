import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  if (!MONGO_URI) {
    console.error("MONGO_URI is not defined");
    return;
  }

  if (mongoose.connection.readyState === 1) return;

  mongoose.set("strictQuery", false);

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");
  } catch (error) {
    console.error("Error connecting to DB:", error.message);
  }
}

export default connectDB;