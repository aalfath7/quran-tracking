import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const token = getHeader(event, "authorization")?.replace("Bearer ", "");

  // if (!token) {
  //   throw createError({
  //     statusCode: 401,
  //     statusMessage: "Token tidak ditemukan",
  //   });
  // }

  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET || "rahasiaSuper");
  //   // Simpan data user di event.context agar bisa dipakai di middleware berikutnya
  //   event.context.user = decoded;
  // } catch (err) {
  //   throw createError({ statusCode: 401, statusMessage: "Token tidak valid" });
  // }
});
