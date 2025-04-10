import { Setoran } from "~/server/models/Setoran";
import { connectToDB } from "~/server/utils/mongoose";

export default defineEventHandler(async (event) => {
  await connectToDB();
  const body = await readBody(event);

  if (
    !body.santriId ||
    !body.guruId ||
    !body.surat ||
    !body.jumlahHalaman ||
    !body.ayat
  ) {
    throw createError({ statusCode: 400, message: "Data tidak lengkap" });
  }

  const setoran = await Setoran.create({
    santri: body.santriId,
    guru: body.guruId,
    surat: body.surat,
    ayat: body.ayat,
    jumlahHalaman: body.jumlahHalaman,
    catatan: body.catatan || "",
  });

  return {
    success: true,
    data: setoran,
  };
});
