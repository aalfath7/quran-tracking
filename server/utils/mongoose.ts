import mongoose from "mongoose";

export const connectToDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/quran-tracking"
    );
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};
