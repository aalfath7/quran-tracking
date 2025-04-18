import { Setoran } from "~/server/models/Setoran";
import { connectToDB } from "~/server/utils/mongoose";

export default defineEventHandler(async (event) => {
  await connectToDB();
  const body = await readBody(event);

  // Validasi data input
  if (
    !body.santriId ||
    !body.guruId ||
    !body.surat ||
    !body.jumlahHalaman ||
    !body.ayat ||
    !body.jenis // Menambahkan validasi untuk 'jenis'
  ) {
    throw createError({ statusCode: 400, message: "Data tidak lengkap" });
  }

  // Membuat setoran baru dengan jenis yang ditambahkan
  const setoran = await Setoran.create({
    santri: body.santriId,
    guru: body.guruId,
    surat: body.surat,
    ayat: body.ayat,
    jumlahHalaman: parseFloat(body.jumlahHalaman),
    catatan: body.catatan || "",
    jenis: body.jenis, // Menambahkan 'jenis' dari request body
  });

  return {
    success: true,
    data: setoran,
  };
});
