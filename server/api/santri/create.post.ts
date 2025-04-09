import { Santri } from "~/server/models/Santri";
import { connectToDB } from "~/server/utils/mongoose";

export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    throw createError({ statusCode: 405, message: "Method Not Allowed" });
  }

  await connectToDB();

  const body = await readBody(event);

  if (!body.nama || !body.halaqoh || !body.kelas) {
    throw createError({
      statusCode: 400,
      message: "Nama, halaqoh, dan kelas wajib diisi.",
    });
  }

  const newSantri = await Santri.create({
    nama: body.nama,
    halaqoh: body.halaqoh,
    kelas: body.kelas,
  });

  return { success: true, data: newSantri };
});
