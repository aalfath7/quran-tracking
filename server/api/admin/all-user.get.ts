import { connectToDB } from "~/server/utils/mongoose";
import User from "~/server/models/User";

export default defineEventHandler(async (event) => {
  await connectToDB();
  const users = await User.find().sort({ createdAt: -1 });
  return { users };
});
