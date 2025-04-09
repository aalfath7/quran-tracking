import { defineEventHandler, readBody } from "h3";
import { Halaqoh } from "~/server/models/Halaqoh";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { nama, guruId } = body;

    if (!nama || !guruId) {
      return { success: false, message: "Nama dan guruId wajib diisi." };
    }

    const newHalaqoh = await Halaqoh.create({
      nama,
      guru: guruId,
    });

    return {
      success: true,
      data: newHalaqoh,
    };
  } catch (err) {
    console.error("Gagal tambah halaqoh:", err);
    return {
      success: false,
      message: "Terjadi kesalahan saat membuat halaqoh.",
    };
  }
});
