import { connectToDB } from "~/server/utils/mongoose";
import Setoran from "~/server/models/Setoran";
import User from "~/server/models/User";

export default defineEventHandler(async (event) => {
  await connectToDB();

  const body = await readBody(event);
  const { guruId, nama_santri, surat, ayat, nilai, catatan } = body;

  const guru = await User.findById(guruId);
  if (!guru || guru.role !== "guru") {
    return sendError(
      event,
      createError({
        statusCode: 403,
        statusMessage: "Hanya guru yang bisa input setoran",
      })
    );
  }

  const newSetoran = new Setoran({
    guru: guru._id,
    nama_santri,
    surat,
    ayat,
    nilai,
    catatan,
  });

  await newSetoran.save();

  return { success: true, setoran: newSetoran };
});
