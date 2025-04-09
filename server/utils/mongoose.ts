import mongoose from "mongoose";

export const connectToDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  const config = useRuntimeConfig();
  const uri: any = config.MONGODB_URI;

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};
