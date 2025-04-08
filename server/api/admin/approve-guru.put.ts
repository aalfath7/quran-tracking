import { connectToDB } from "~/server/utils/mongoose";
import User from "~/server/models/User";

export default defineEventHandler(async (event) => {
  await connectToDB();

  const body = await readBody(event);
  const { userId } = body;

  if (!userId) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: "ID user diperlukan" })
    );
  }

  const user = await User.findById(userId);

  if (!user) {
    return sendError(
      event,
      createError({ statusCode: 404, statusMessage: "Guru tidak ditemukan" })
    );
  }

  if (user.role !== "guru") {
    return sendError(
      event,
      createError({ statusCode: 403, statusMessage: "User ini bukan guru" })
    );
  }

  user.isApproved = true;
  await user.save();

  return {
    message: "Guru berhasil disetujui",
    user: {
      _id: user._id,
      username: user.username,
      isApproved: user.isApproved,
    },
  };
});
