import { connectToDB } from "@/server/utils/mongoose";
import User from "@/server/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getCookie } from "h3";

export default defineEventHandler(async (event) => {
  await connectToDB();

  const token = getCookie(event, "token");

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Token tidak ditemukan",
    });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    throw createError({
      statusCode: 401,
      statusMessage: "Token tidak valid",
    });
  }

  const userId = decoded.id;

  const body = await readBody(event);
  const { name, username, password, oldPassword } = body;

  if (!name && !username && !password && !oldPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: "Tidak ada data untuk diperbarui",
    });
  }

  const updateData: any = {};

  const user = await User.findById(userId);
  if (password && oldPassword) {
    // Cek apakah password lama yang diberikan cocok dengan yang ada di database
    const passwordMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!passwordMatch) {
      throw createError({
        statusCode: 400,
        statusMessage: "Password lama salah",
      });
    }

    // Jika password lama benar, hash password baru
    const hashedPassword = await bcrypt.hash(password, 10);
    updateData.password = hashedPassword;
  }

  if (name) updateData.name = name;
  if (username) updateData.username = username;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    // Jika password baru diubah, buat token baru
    let newToken = token;
    newToken = jwt.sign(
      {
        id: updatedUser._id,
        username: updatedUser.username,
        role: updatedUser.role,
        name: updatedUser.name,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
    return {
      success: true,
      message: "Profil berhasil diperbarui",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        role: updatedUser.role,
        name: updatedUser.name,
      },
      token: newToken, // Kirim token baru jika password diubah
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Gagal memperbarui profil",
    });
  }
});
