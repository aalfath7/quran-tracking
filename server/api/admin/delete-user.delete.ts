import { connectToDB } from "~/server/utils/mongoose";
import User from "~/server/models/User";

export default defineEventHandler(async (event) => {
  await connectToDB();
  const body = await readBody(event);
  const userId = body.userId;
  await User.findByIdAndDelete(userId);
  return { message: "User berhasil dihapus" };
});
