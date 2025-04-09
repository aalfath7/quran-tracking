import { connectToDB } from "~/server/utils/mongoose";
import User from "~/server/models/User";

export default defineEventHandler(async (event) => {
  await connectToDB();

  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    return { users };
  } catch (error) {
    console.error("❌ Error mengambil data user:", error);
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "Gagal mengambil data pengguna",
      })
    );
  }
});
