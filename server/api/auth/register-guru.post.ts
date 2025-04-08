import { connectToDB } from "@/server/utils/mongoose";
import User from "@/server/models/User";
import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  await connectToDB(); // Wajib panggil ini dulu

  const body = await readBody(event);
  const { name, username, password } = body;

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Username dan password wajib diisi",
    });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: "Username sudah terdaftar",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    username,
    name: name, // default name sama dengan username
    password: hashedPassword,
    role: "guru",
    isApproved: false,
  });

  return { message: "Pendaftaran berhasil, menunggu persetujuan admin." };
});
