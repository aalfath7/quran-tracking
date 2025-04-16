import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDB } from "~/server/utils/mongoose";
import User from "~/server/models/User";
import { setCookie } from "h3";

export default defineEventHandler(async (event) => {
  await connectToDB();
  const { username, password } = await readBody(event);

  const user = await User.findOne({ username });
  if (!user) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: "User tidak ditemukan" })
    );
  }

  // ⛔️ Tambahan: cek jika user guru dan belum disetujui
  if (user.role === "guru" && !user.isApproved) {
    return sendError(
      event,
      createError({
        statusCode: 403,
        statusMessage: "Akun Anda belum disetujui oleh admin.",
      })
    );
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: "Password salah" })
    );
  }

  // Buat JWT dengan menambahkan name ke dalam payload
  const token = jwt.sign(
    { id: user._id, role: user.role, username: user.username, name: user.name }, // Menambahkan name
    process.env.JWT_SECRET || "sangat_rahasia",
    { expiresIn: "7d" }
  );

  // setCookie(event, "token", token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "strict",
  //   path: "/",
  //   maxAge: 60 * 60 * 24 * 7, // 7 hari dalam detik
  // });

  return {
    token,
    user: {
      _id: user._id,
      username: user.username,
      role: user.role,
      name: user.name, // Menambahkan name di respons
    },
  };
});
