import { connectToDB } from "~/server/utils/mongoose";
import User from "~/server/models/User";

export default defineEventHandler(async (event) => {
  await connectToDB();

  const pendingGurus = await User.find({
    role: "guru",
    isApproved: false,
  }).select("-password");

  return {
    gurus: pendingGurus,
  };
});
